/**
* PHP Equivalent Functions in JS
* @author Mohamad Mohebifar
*/

function in_array(needle, haystack) {
    for(var i in haystack) {
        if(haystack[i] == needle)
        {
            return true;
            break;
        }
    }
    return false;
}

function array_search(needle, haystack) {
    for(var i in haystack)
    {
        if(haystack[i] == needle)
        {
            return i;
            break;
        }
    }
    return false;
}


jQuery.fn.sortElements = (function(){
 
    var sort = [].sort;
 
    return function(comparator, getSortable) {
 
        getSortable = getSortable || function(){return this;};
 
        var placements = this.map(function(){
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
 
                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
 
            return function() {
 
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
 
                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
 
            };
 
        });
 
        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });
 
    };
})();