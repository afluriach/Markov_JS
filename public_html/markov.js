//Electric Sun Studio Copyright (c) 2014

//http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.ctor )
        this.ctor.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

//map each word to an ID
var wordMap = {};
//and each ID back to word
var idMap = {}
var nextWordId = 1;
var prevPrefixLen = null;
var hasReadInput = false;

function getWordId(word)
{
    if(!(word in wordMap))
    {
        wordMap[word] = nextWordId++;
        idMap[wordMap[word]] = word;
        console.log(word + "->" + wordMap[word]);
    }

    return wordMap[word];
}

TrieNode = Class.extend({
    ctor: function()
    {
        this.next = {}
        //if the sequence ends here, the result
        this.end = null;
    },
    addSequence: function(seq, val)
    {
        if(seq.length === 0)
        {
            if(this.end === null) this.end = [];
            this.end.push(val);
            return;
        }
        var crnt = seq[0];
        
        if(!(crnt in this.next))
            this.next[crnt] = new TrieNode();
        
        this.next[crnt].addSequence(seq.slice(1), val);
    },
    print: function(seq)
    {
        if(this.end !== null)
        {
            var prefix = seq.join(" ");
            console.log(prefix + " -> " + this.end.join(","));
        }
        
        for(var word in this.next)
        {
            seq.push(word);
            this.next[word].print(seq);
            seq.pop();
        }
    },
    //returns null if the prefix is not in the trie
    getSuffix: function(prefix)
    {
        if(prefix.length === 0) return this.end;
        
        if(!(prefix[0] in this.next)) return null;
        
        return this.next[prefix[0]].getSuffix(prefix.slice(1));
    }
});

trie = new TrieNode();

//convert a sequnce of words to IDs
function idSequence(seq)
{
    var result = [];
    for(var i=0;i<seq.length; ++i)
    {
        result.push(getWordId(seq[i]))
    }
    return result;
}

//convert a sequence of IDs to words
function wordSequence(seq)
{
    var result = [];
    for(var i=0;i<seq.length; ++i)
    {
        result.push(idMap[seq[i]]);
    }
    return result;
}

function addEntry(prefix, word)
{
    console.log(prefix.join(",") + "->" + word);
    trie.addSequence(prefix, word);
}

function parseSample(str, prefixLen)
{
    var arrWords = str.split(" ");
    var arrIds = idSequence(arrWords);
    
    for(var i=0;i<arrIds.length; ++i)
    {
        addEntry(getPrefix(arrIds, i, prefixLen), arrIds[i]);
    }
}

//get array slice representing the prefix of the word at position idx.
//length of len in the general case, but will be less if idx < len
function getPrefix(arr, idx, len)
{
    if(idx < len)
    {
        return arr.slice(0, idx);
    }
    return arr.slice(idx-len, idx);
}

function build(prefixLen, maxLen)
{
    var outputSequence = [];
    var prefix = [];
    
    while(true)
    {
        if(outputSequence.length >= maxLen) break;
        
        var next = trie.getSuffix(prefix);
        if(next === null || next.length === 0) break;
        
        var nextWordId = next[Math.floor(Math.random()*next.length)];
        
        if(prefix.length === prefixLen )
        {
            outputSequence.push(prefix.shift());
        }
        
        prefix.push(nextWordId);
    }
    
    //push remaining prefix buffer into the output sequence
    while(prefix.length > 0 && outputSequence.length < maxLen)
    {
        outputSequence.push(prefix.shift());
    }
    
    return wordSequence(outputSequence).join(" ");
}

//cumulative, i.e. do not clear previous input data
function readInput()
{
    var input = document.getElementById('input').value;
    var lines = input.split("\n");
    var prefixLen = parseInt(document.getElementById('prefix_len').value);
    
    if(isNaN(prefixLen))
    {
        alert("Prefix length must be an integer!");
        return;
    }
    else if(prefixLen <= 0)
    {
        alert("Prefix length must be greater than 0!");
        return;
    }
    
    //cannot be cumulative if the prefix length has changed
    if(prevPrefixLen !== null && prevPrefixLen !== prefixLen)
    {
        trie = new TrieNode();
    }
    prevPrefixLen = prefixLen;
    
    for(var i=0;i<lines.length; ++i)
    {
        parseSample(lines[i], prefixLen);
    }
    hasReadInput = true;
}

function outputSample()
{
    if(!hasReadInput)
    {
        alert("Must give an input sample first!");
        return;
    }
    var maxLen = parseInt(document.getElementById('max_len').value);
    if(isNaN(maxLen))
    {
        alert("Max length must be an integer!");
        return;
    }
    else if(maxLen <= 0)
    {
        alert("Max length must be greater than 0!");
        return;
    }
    
    document.getElementById('output').value = build(prevPrefixLen, maxLen);
}