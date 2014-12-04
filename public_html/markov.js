//Electric Sun Studio Copyright (c) 2014

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
        //console.log(word + "->" + wordMap[word]);
    }

    return wordMap[word];
}

TrieNode = function()
{
    this.next = {}
    //if the sequence ends here, the result
    this.end = null;
};

TrieNode.prototype =  {
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
    //pass along index instead of successively slicing/popping array
    getSuffix: function(prefix, idx)
    {
        if(prefix.length === idx) return this.end;
        
        if(!(prefix[idx] in this.next)) return null;
        
        return this.next[prefix[idx]].getSuffix(prefix, idx+1);
    }
};

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
    //console.log(prefix.join(",") + "->" + word);
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
        
        var next = trie.getSuffix(prefix, 0);
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
        alert("Prefix length changed, previous input samples discarded.");
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