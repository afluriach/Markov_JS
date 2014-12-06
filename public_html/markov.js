//Electric Sun Studio Copyright (c) 2014

//map each word to an ID
var wordMap = {};
//and each ID back to word
var idMap = {}
var nextWordId = 1;
var prevPrefixLen = null;
var hasReadInput = false;

var openSingleQuote  = "‘";
var closeSingleQuote = "’";
var openDoubleQuote = "“";
var closeDoubleQuote = "”";
var emDash = '—';
var enDash = '–';

var openingPunctuation =
{
    '(' : true,
    '[' : true,
}

var closingPunctuation =
{
    ')' : true,
    ']' : true,
    ',' : true,
    ';' : true,
    ':' : true,
    '.' : true,
    '?' : true,
    '!' : true,
};

//borrowed from XRegExp Unicode; definition of unicode letters
https://github.com/slevithan/xregexp/blob/master/src/addons/unicode/unicode-categories.js
var letterRangesString = 'AZaz\xAA\xB5\xBA\xC0\xD6\xD8\xF6\xF8\u02C1\u02C6\u02D1\u02E0\u02E4\u02EC\u02EE\u0370\u0374\u0376\u0377\u037A\u037D\u037F\u0386\u0388\u038A\u038C\u038E\u03A1\u03A3\u03F5\u03F7\u0481\u048A\u052F\u0531\u0556\u0559\u0561\u0587\u05D0\u05EA\u05F0\u05F2\u0620\u064A\u066E\u066F\u0671\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA\u06FC\u06FF\u0710\u0712\u072F\u074D\u07A5\u07B1\u07CA\u07EA\u07F4\u07F5\u07FA\u0800\u0815\u081A\u0824\u0828\u0840\u0858\u08A0\u08B2\u0904\u0939\u093D\u0950\u0958\u0961\u0971\u0980\u0985\u098C\u098F\u0990\u0993\u09A8\u09AA\u09B0\u09B2\u09B6\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF\u09E1\u09F0\u09F1\u0A05\u0A0A\u0A0F\u0A10\u0A13\u0A28\u0A2A\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59\u0A5C\u0A5E\u0A72\u0A74\u0A85\u0A8D\u0A8F\u0A91\u0A93\u0AA8\u0AAA\u0AB0\u0AB2\u0AB3\u0AB5\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05\u0B0C\u0B0F\u0B10\u0B13\u0B28\u0B2A\u0B30\u0B32\u0B33\u0B35\u0B39\u0B3D\u0B5C\u0B5D\u0B5F\u0B61\u0B71\u0B83\u0B85\u0B8A\u0B8E\u0B90\u0B92\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8\u0BAA\u0BAE\u0BB9\u0BD0\u0C05\u0C0C\u0C0E\u0C10\u0C12\u0C28\u0C2A\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85\u0C8C\u0C8E\u0C90\u0C92\u0CA8\u0CAA\u0CB3\u0CB5\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05\u0D0C\u0D0E\u0D10\u0D12\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A\u0D7F\u0D85\u0D96\u0D9A\u0DB1\u0DB3\u0DBB\u0DBD\u0DC0\u0DC6\u0E01\u0E30\u0E32\u0E33\u0E40\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94\u0E97\u0E99\u0E9F\u0EA1\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0\u0EC4\u0EC6\u0EDC\u0EDF\u0F00\u0F40\u0F47\u0F49\u0F6C\u0F88\u0F8C\u1000\u102A\u103F\u1050\u1055\u105A\u105D\u1061\u1065\u1066\u106E\u1070\u1075\u1081\u108E\u10A0\u10C5\u10C7\u10CD\u10D0\u10FA\u10FC\u1248\u124A\u124D\u1250\u1256\u1258\u125A\u125D\u1260\u1288\u128A\u128D\u1290\u12B0\u12B2\u12B5\u12B8\u12BE\u12C0\u12C2\u12C5\u12C8\u12D6\u12D8\u1310\u1312\u1315\u1318\u135A\u1380\u138F\u13A0\u13F4\u1401\u166C\u166F\u167F\u1681\u169A\u16A0\u16EA\u16F1\u16F8\u1700\u170C\u170E\u1711\u1720\u1731\u1740\u1751\u1760\u176C\u176E\u1770\u1780\u17B3\u17D7\u17DC\u1820\u1877\u1880\u18A8\u18AA\u18B0\u18F5\u1900\u191E\u1950\u196D\u1970\u1974\u1980\u19AB\u19C1\u19C7\u1A00\u1A16\u1A20\u1A54\u1AA7\u1B05\u1B33\u1B45\u1B4B\u1B83\u1BA0\u1BAE\u1BAF\u1BBA\u1BE5\u1C00\u1C23\u1C4D\u1C4F\u1C5A\u1C7D\u1CE9\u1CEC\u1CEE\u1CF1\u1CF5\u1CF6\u1D00\u1DBF\u1E00\u1F15\u1F18\u1F1D\u1F20\u1F45\u1F48\u1F4D\u1F50\u1F57\u1F59\u1F5B\u1F5D\u1F5F\u1F7D\u1F80\u1FB4\u1FB6\u1FBC\u1FBE\u1FC2\u1FC4\u1FC6\u1FCC\u1FD0\u1FD3\u1FD6\u1FDB\u1FE0\u1FEC\u1FF2\u1FF4\u1FF6\u1FFC\u2071\u207F\u2090\u209C\u2102\u2107\u210A\u2113\u2115\u2119\u211D\u2124\u2126\u2128\u212A\u212D\u212F\u2139\u213C\u213F\u2145\u2149\u214E\u2183\u2184\u2C00\u2C2E\u2C30\u2C5E\u2C60\u2CE4\u2CEB\u2CEE\u2CF2\u2CF3\u2D00\u2D25\u2D27\u2D2D\u2D30\u2D67\u2D6F\u2D80\u2D96\u2DA0\u2DA6\u2DA8\u2DAE\u2DB0\u2DB6\u2DB8\u2DBE\u2DC0\u2DC6\u2DC8\u2DCE\u2DD0\u2DD6\u2DD8\u2DDE\u2E2F\u3005\u3006\u3031\u3035\u303B\u303C\u3041\u3096\u309D\u309F\u30A1\u30FA\u30FC\u30FF\u3105\u312D\u3131\u318E\u31A0\u31BA\u31F0\u31FF\u3400\u4DB5\u4E00\u9FCC\uA000\uA48C\uA4D0\uA4FD\uA500\uA60C\uA610\uA61F\uA62A\uA62B\uA640\uA66E\uA67F\uA69D\uA6A0\uA6E5\uA717\uA71F\uA722\uA788\uA78B\uA78E\uA790\uA7AD\uA7B0\uA7B1\uA7F7\uA801\uA803\uA805\uA807\uA80A\uA80C\uA822\uA840\uA873\uA882\uA8B3\uA8F2\uA8F7\uA8FB\uA90A\uA925\uA930\uA946\uA960\uA97C\uA984\uA9B2\uA9CF\uA9E0\uA9E4\uA9E6\uA9EF\uA9FA\uA9FE\uAA00\uAA28\uAA40\uAA42\uAA44\uAA4B\uAA60\uAA76\uAA7A\uAA7E\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9\uAABD\uAAC0\uAAC2\uAADB\uAADD\uAAE0\uAAEA\uAAF2\uAAF4\uAB01\uAB06\uAB09\uAB0E\uAB11\uAB16\uAB20\uAB26\uAB28\uAB2E\uAB30\uAB5A\uAB5C\uAB5F\uAB64\uAB65\uABC0\uABE2\uAC00\uD7A3\uD7B0\uD7C6\uD7CB\uD7FB\uF900\uFA6D\uFA70\uFAD9\uFB00\uFB06\uFB13\uFB17\uFB1D\uFB1F\uFB28\uFB2A\uFB36\uFB38\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46\uFBB1\uFBD3\uFD3D\uFD50\uFD8F\uFD92\uFDC7\uFDF0\uFDFB\uFE70\uFE74\uFE76\uFEFC\uFF21\uFF3A\uFF41\uFF5A\uFF66\uFFBE\uFFC2\uFFC7\uFFCA\uFFCF\uFFD2\uFFD7\uFFDA\uFFDC';

function buildLetterSet()
{
    var result = {};

    for(var i=0;i<letterRangesString.length; i+=2)
    {
        //put every letter in the range into the set
        var start = letterRangesString.charCodeAt(i);
        var end = letterRangesString.charCodeAt(i+1);
        
        for(var ch = start; ch <= end; ++ch)
        {
            result[ch] = true;
        }
    }
    return result;
}

var letterSet = buildLetterSet();

function wordLength(str, pos)
{
    var len = 0;
    for(var i=pos; i < str.length; ++i, ++len)
    {
        //check for apostrophe in the word. the character must be a letter and
        //check for end of string
        if((str[i] === "'" || str[i] === closeSingleQuote) &&
           i < str.length-1 && (str.charCodeAt(i+1) in letterSet)) continue;
        //similarly, check for compound words. hyphens must not be consecutive
        if(str[i] === "-" &&
           i < str.length-1 && (str.charCodeAt(i+1) in letterSet)) continue;
        else if(!(str.charCodeAt(i) in letterSet)) break;
    }
    return len;
}

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

function dashLength(str, idx)
{
    var count = 0;
    for(var i=idx; i < str.length; ++i, ++count)
    {
        if(str[idx] !== '-') break;
    }
    
    if(count >= 2) return count;
    else return 0;
}

function tokenizeWord(word)
{
    var tokens = [];
    var idx = 0;
    
    //check for opening punctuation (open quotes, open parens)
    //convert straight quotes to open quotes
    while(idx < word.length)
    {
        var ch = word[idx];
        
        if(ch === "'" || ch === openSingleQuote)
        {
            tokens.push(openSingleQuote);
            ++idx;
        }
        else if(ch === '"' || ch === openDoubleQuote)
        {
            tokens.push(openDoubleQuote);
            ++idx;
        }
        else if(ch === "(")
        {
            tokens.push("(");
            ++idx;
        }
        else break;
    }
    
    //check for dashes and determine word bounaries
    while(idx < word.length)
    {
        var dash = dashLength(word, idx);
        if(dash > 0)
        {
            tokens.push(emDash);
            idx += dash;
        }
        else if(word[idx] === emDash || word[idx] === enDash)
        {
            tokens.push(emDash);
            ++idx;
        }
        else
        {
            var wordLen = wordLength(word, idx);
            if(wordLen > 0)
            {
                tokens.push(word.slice(idx, idx+wordLen));
                idx += wordLen;
            }
            else break;
        }
    }
    
    //check for ending punctuation (close quotes, close parens, comma, colon,
    //semicolon, period, question, exclamation)
    //convert straight quotes to close quotes
    while(idx < word.length)
    {
        var ch = word[idx];

        if(ch === "'" || ch === closeSingleQuote)
        {
            tokens.push(closeSingleQuote);
            ++idx;
        }
        else if(ch === '"' || ch === closeDoubleQuote)
        {
            tokens.push(closeDoubleQuote);
            ++idx;
        }
        else if(ch in closingPunctuation)
        {
            tokens.push(ch);
            ++idx;
        }
        else break;
    }
    return tokens;
}

//parse a line of input text and add it to the model
function parseSample(inputSample, prefixLen)
{
    var spaceSeparatedTokens = inputSample.split(" ");
    var tokens = [];
    
    for(var i=0;i<spaceSeparatedTokens.length; ++i)
    {
        tokens = tokens.concat(tokenizeWord(spaceSeparatedTokens[i]));
    }
    
    var tokenIds = idSequence(tokens);
    
    for(var i=0;i<tokenIds.length; ++i)
    {
        addEntry(getPrefix(tokenIds, i, prefixLen), tokenIds[i]);
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
    
    return joinTokens(wordSequence(outputSequence));
}

//with regards to spacing, there are four classes of tokens: opening punctuation,
//closing punctuation, words, and dashes
//space should follow a word if the next token is a word or opening punc.
//space should follow a dash if it is followed by opening punc. dash-dash doesn't need space
//space should not follow opening punc.
//space should follow closing punc. unless the next token is closing punc.
var SpacingClass = {
    word: "word",
    dash: "dash",
    opening: "opening",
    closing: "closing"
}

function getSpacingClass(token)
{
    if(token === emDash) return SpacingClass.dash;
    else if(token in openingPunctuation || token === openSingleQuote || token===openDoubleQuote) return SpacingClass.opening;
    else if(token in closingPunctuation || token === closeSingleQuote || token===closeDoubleQuote) return SpacingClass.closing;
    else return SpacingClass.word;
}

function isSpaced(prevToken, nextToken)
{
    if(prevToken === null) return false;
    
    var prevCls = getSpacingClass(prevToken);
    var nextCls = getSpacingClass(nextToken);
    
    console.log(prevToken + " " + nextToken + " " + prevCls + " " + nextCls);
    
    switch(prevCls)
    {
        case SpacingClass.word:
            return nextCls === SpacingClass.word || nextCls === SpacingClass.opening;
        case SpacingClass.dash:
            return nextCls === SpacingClass.opening;
        case SpacingClass.opening:
            return false;
        case SpacingClass.closing:
            return nextCls !== SpacingClass.closing;
    }
}

//join tokens with regard to word and punctuation spacing
function joinTokens(tokens)
{
    var strings = [];
    var lastToken = null;
    
    for(var i=0;i<tokens.length; ++i)
    {
        var crntToken = tokens[i];
        if(isSpaced(lastToken,crntToken))
        {
            console.log("is spaced");
            strings.push(" ");
        }
        strings.push(crntToken);
        lastToken = crntToken;
    }
    return strings.join("");
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