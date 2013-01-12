function set_up_keyboard_shortcuts()
{
    if (window.addEventListener) // are we *not* in ie?
    {
        document.addEventListener('keyup', function(e){pb_shortcuts.handle_key(e)}, false);
    }
    else { // otherwise listen to the event in ie
        document.attachEvent('onkeyup', pb_shortcuts.handle_key);
    }
}


function set_up_shortcuts()
{
    pb_shortcuts.set_shortcut('A', '/', true);
    pb_shortcuts.set_shortcut('U', '/toread/', true);
    pb_shortcuts.set_shortcut('N', '/network/', true);
    pb_shortcuts.set_shortcut('S', '/settings/', true);
    pb_shortcuts.set_shortcut('T', '/tweets/', true);
    pb_shortcuts.set_shortcut('?', function(e){show_overlay(e)}, false);
    pb_shortcuts.set_shortcut('B', function()
    {
        ec.toggle_edit();
    }, false);
    
    pb_shortcuts.set_shortcut('/', function(e)
    { 
        //console.log('focusing');
        var ss = document.getElementById('search_query_field');
        if (e.stopPropagation)
            {
                e.stopPropagation();
            } else
            {
                e.cancelBubble = true;
            }
        ss.focus();
        
    }, false);
    pb_shortcuts.set_shortcut('J', function()
        {
            flashElement('top_earlier');
            window.location = pb_last_link;
        }, false);
    pb_shortcuts.set_shortcut('K', function()
        {
            flashElement('top_later');
            window.location = pb_first_link;
        }, false);
}


function flashElement(el)
{
    var el = document.getElementById(el);
    setElementBackground(el, '#ffa');
}

function setElementBackground(el, color)
{
    el.style.background = color;  
}


function Pinboard_Shortcuts(){}

Pinboard_Shortcuts.prototype = 
{
    shortcuts : {}, 
    g_shortcuts : {}, 
    
    disable : function()
    {
        this.ignore = true;
        this.g_mode = false;
    },
    
    enable : function()
    {
        this.ignore = false;
    },
    
    handle_key : function(e)
    {
        var k =  e.keyCode;
        // test for question mark
        if ((k === 191) && e.shiftKey){  k = '63'; }
        if (k === 0){  k = '63'; }
        //console.log('got a key event ' + k);
        //console.log('got a charcode ' + e.charCode);

        if (k === 27)
        {
            if ($ebx.visible)
            {
                ec.toggle_edit();
                return;
            }
            if (ef.visible)
            {
                ef.hide();
                return;
            }
        }
        if (this.ignore) { return; }
                
        if (this.g_mode)
        {
            //console.log('g mode on');
            if (this.g_shortcuts[k])
            {
                this.g_shortcuts[k](e);
            }
        }
        if (this.shortcuts[k])
        {
            this.shortcuts[k](e);
        }
        this.g_mode = (k === 71); // g key sets up special combo
        
		return false;
    },
    
    set_shortcut : function(k, action, g_mode)
    {
        var code = k.charCodeAt(0);
        if (k === '/') { code = 191; }
        //console.log("code " + k + " is " + code);
        var bin = g_mode ? 'g_shortcuts' : 'shortcuts';
        if (typeof(action) === 'function')
        {
            this[bin][code] = action;
        } 
        else
        {
            this[bin][code] = function(){ document.location = action; };
        }
    }
}

function show_overlay(e)
{
    var overlay = document.getElementById('overlay');
    Pin.Lang.show(overlay);
   
    document.addEventListener('scroll', function()
    { 
       // console.log('scrollin ' + document.body.scrollTop);
        document.getElementById('overlay_bak').style.top = document.body.scrollTop + 'px'; 
    }, false);
    var s = function(e)
    {
        //console.log(e.charCode);
        Pin.Lang.hide(overlay);
        window.onscroll = null;
        
        if (e.stopPropagation)
        {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        document.removeEventListener('keydown', this, true);
        return false;
    };
    document.addEventListener('keydown', s, true);
}

