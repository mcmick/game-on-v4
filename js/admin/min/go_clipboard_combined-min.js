function go_toggle(t){checkboxes=jQuery(".go_checkbox");for(var e=0,o=checkboxes.length;e<o;e++)checkboxes[e].checked=t.checked}function go_toggle_off(){checkboxes=jQuery(".go_checkbox");for(var t=0,e=checkboxes.length;t<e;t++)checkboxes[t].checked=!1}function go_clipboard_class_a_choice(){if(go_filter_datatables(),jQuery("#go_clipboard_stats_datatable").length){var t=jQuery("#go_clipboard_stats_datatable").DataTable({bPaginate:!1,order:[[5,"asc"]],responsive:!0,autoWidth:!1,stateSave:!0,dom:"Bfrtip",drawCallback:function(t){jQuery(".go_messages_icon").prop("onclick",null).off("click"),jQuery(".go_messages_icon").one("click",function(t){go_messages_opener()}),go_stats_links()},columnDefs:[{type:"natural",targets:"_all"},{targets:[0],className:"noVis",width:"1px",sortable:!1},{targets:[1],className:"noVis",width:"20px",sortable:!1},{targets:[2],visible:!1,className:"noVis"},{targets:[3],visible:!1,className:"noVis"},{targets:[4],visible:!1,className:"noVis"},{targets:[7],className:"noVis"},{targets:[8],className:"noVis"},{targets:[10],className:"noVis",sortable:!1}],buttons:[{text:'<span class="go_messages_icon">Message <i class="fa fa-bullhorn" aria-hidden="true"></i><span></span>',action:function(t,e,o,a){}},{extend:"collection",text:"Export ...",buttons:[{extend:"pdf",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"},orientation:"landscape"},{extend:"excel",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}},{extend:"csv",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}}]},{extend:"colvis",columns:":not(.noVis)",postfixButtons:["colvisRestore"],text:"Column Visibility"}]});jQuery("#go_clipboard_user_go_sections_select, #go_clipboard_user_go_groups_select, #go_clipboard_go_badges_select").change(function(){t.draw();var e=GO_CLIPBOARD_DATA.nonces.go_clipboard_save_filters,o=jQuery("#go_clipboard_user_go_sections_select").val(),a=jQuery("#go_clipboard_user_go_groups_select").val(),s=jQuery("#go_clipboard_go_badges_select").val();jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_clipboard_save_filters",section:o,badge:s,group:a},success:function(t){}})}),jQuery("#records_tabs").css("margin-left","")}jQuery("#go_clipboard_stats_datatable").DataTable().columns.adjust().responsive.recalc()}function go_clipboard_class_a_choice_activity(t){if(0==jQuery("#go_clipboard_activity_datatable").length||1==t){var e=GO_CLIPBOARD_DATA.nonces.go_clipboard_intable_activity,o=jQuery(".datepicker").val();jQuery.ajax({type:"post",url:MyAjax.ajaxurl,data:{_ajax_nonce:e,action:"go_clipboard_intable_activity",go_clipboard_class_a_choice_activity:jQuery("#go_clipboard_class_a_choice_activity").val(),date:jQuery(".datepicker").val()},success:function(t){if(-1!==t){jQuery("#clipboard_activity_datatable_container").html(t);var e=jQuery("#go_clipboard_activity_datatable").DataTable({bPaginate:!1,order:[[4,"asc"]],responsive:!0,autoWidth:!1,stateSave:!0,dom:"Bfrtip",drawCallback:function(t){jQuery(".go_messages_icon").prop("onclick",null).off("click"),jQuery(".go_messages_icon").one("click",function(t){go_messages_opener()}),go_stats_links()},columnDefs:[{type:"natural",targets:"_all"},{targets:[0],className:"noVis",width:"5px",sortable:!1},{targets:[1],className:"noVis",width:"20px",sortable:!1},{targets:[2],visible:!1,className:"noVis"},{targets:[3],visible:!1,className:"noVis"},{targets:[4],visible:!1,className:"noVis"},{targets:[7],className:"noVis"},{targets:[8],className:"noVis"},{targets:[10],className:"noVis",sortable:!1}],buttons:[{text:'<span class="go_messages_icon">Message <i class="fa fa-bullhorn" aria-hidden="true"></i><span></span>',action:function(t,e,o,a){}},{extend:"collection",text:"Export ...",buttons:[{extend:"pdf",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"},orientation:"landscape"},{extend:"excel",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}},{extend:"csv",title:"Game On Data Export",exportOptions:{columns:"thead th:not(.noExport)"}}]},{extend:"colvis",columns:":not(.noVis)",postfixButtons:["colvisRestore"],text:"Column Visibility"}]});jQuery("#go_timestamp_filters").show(),jQuery("#go_clipboard_user_go_sections_select, #go_clipboard_user_go_groups_select, #go_clipboard_go_badges_select").change(function(){e.draw()}),jQuery("#go_clipboard_activity_datatable .show_more").click(function(){0==jQuery(this).hasClass("shown")?(jQuery(this).addClass("shown"),jQuery(this).siblings(".hidden_action").show(),jQuery(this).find(".hide_more_actions").show(),jQuery(this).find(".show_more_actions").hide()):(jQuery(this).removeClass("shown"),jQuery(this).siblings(".hidden_action").hide(),jQuery(this).find(".hide_more_actions").hide(),jQuery(this).find(".show_more_actions").show())})}}})}}function dean_addEvent(t,e,o){if(t.addEventListener)t.addEventListener(e,o,!1);else{o.$$guid||(o.$$guid=dean_addEvent.guid++),t.events||(t.events={});var a=t.events[e];a||(a=t.events[e]={},t["on"+e]&&(a[0]=t["on"+e])),a[o.$$guid]=o,t["on"+e]=handleEvent}}function removeEvent(t,e,o){t.removeEventListener?t.removeEventListener(e,o,!1):t.events&&t.events[e]&&delete t.events[e][o.$$guid]}function handleEvent(t){var e=!0;t=t||fixEvent(((this.ownerDocument||this.document||this).parentWindow||window).event);var o=this.events[t.type];for(var a in o)this.$$handleEvent=o[a],!1===this.$$handleEvent(t)&&(e=!1);return e}function fixEvent(t){return t.preventDefault=fixEvent.preventDefault,t.stopPropagation=fixEvent.stopPropagation,t}jQuery(document).ready(function(){jQuery("#records_tabs").length&&(jQuery("#records_tabs").tabs(),jQuery(".clipboard_tabs").click(function(){switch(tab=jQuery(this).attr("tab"),tab){case"activity":go_clipboard_class_a_choice_activity(),jQuery("#go_clipboard_activity_datatable").DataTable().columns.adjust().responsive.recalc();break;case"clipboard":jQuery("#go_clipboard_stats_datatable").DataTable().columns.adjust().responsive.recalc();break}})),jQuery("#go_clipboard_stats_datatable").length&&(go_clipboard_class_a_choice(),jQuery(".datepicker").datepicker({firstDay:0}),jQuery(".datepicker").datepicker("setDate",new Date),jQuery(".datepicker").change(function(){jQuery("#go_clipboard_activity_datatable").html("<div id='loader' style='font-size: 1.5em; text-align: center; height: 200px'>loading . . .</div>"),go_clipboard_class_a_choice_activity(!0)}),jQuery(".go_datepicker_refresh").click(function(){jQuery("#go_clipboard_activity_datatable").html("<div id='loader' style='font-size: 1.5em; text-align: center; height: 200px'>loading . . .</div>"),go_clipboard_class_a_choice_activity(!0)}))});var stIsIE=/*@cc_on!@*/!1;/*@cc_on @*/
if(sorttable={init:function(){arguments.callee.done||(arguments.callee.done=!0,_timer&&clearInterval(_timer),document.createElement&&document.getElementsByTagName&&(sorttable.DATE_RE=/^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/,forEach(document.getElementsByTagName("table"),function(t){-1!=t.className.search(/\bsortable\b/)&&sorttable.makeSortable(t)})))},makeSortable:function(t){if(0==t.getElementsByTagName("thead").length&&(the=document.createElement("thead"),the.appendChild(t.rows[0]),t.insertBefore(the,t.firstChild)),null==t.tHead&&(t.tHead=t.getElementsByTagName("thead")[0]),1==t.tHead.rows.length){sortbottomrows=[];for(var e=0;e<t.rows.length;e++)-1!=t.rows[e].className.search(/\bsortbottom\b/)&&(sortbottomrows[sortbottomrows.length]=t.rows[e]);if(sortbottomrows){null==t.tFoot&&(tfo=document.createElement("tfoot"),t.appendChild(tfo));for(var e=0;e<sortbottomrows.length;e++)tfo.appendChild(sortbottomrows[e]);delete sortbottomrows}headrow=t.tHead.rows[0].cells;for(var e=0;e<headrow.length;e++)headrow[e].className.match(/\bsorttable_nosort\b/)||(mtch=headrow[e].className.match(/\bsorttable_([a-z0-9]+)\b/),mtch&&(override=mtch[1]),mtch&&"function"==typeof sorttable["sort_"+override]?headrow[e].sorttable_sortfunction=sorttable["sort_"+override]:headrow[e].sorttable_sortfunction=sorttable.guessType(t,e),headrow[e].sorttable_columnindex=e,headrow[e].sorttable_tbody=t.tBodies[0],dean_addEvent(headrow[e],"click",sorttable.innerSortFunction=function(t){if(-1!=this.className.search(/\bsorttable_sorted\b/))return sorttable.reverse(this.sorttable_tbody),this.className=this.className.replace("sorttable_sorted","sorttable_sorted_reverse"),this.removeChild(document.getElementById("sorttable_sortfwdind")),sortrevind=document.createElement("span"),sortrevind.id="sorttable_sortrevind",sortrevind.innerHTML=stIsIE?'&nbsp<font face="webdings">5</font>':"&nbsp;&#x25B4;",void this.appendChild(sortrevind);if(-1!=this.className.search(/\bsorttable_sorted_reverse\b/))return sorttable.reverse(this.sorttable_tbody),this.className=this.className.replace("sorttable_sorted_reverse","sorttable_sorted"),this.removeChild(document.getElementById("sorttable_sortrevind")),sortfwdind=document.createElement("span"),sortfwdind.id="sorttable_sortfwdind",sortfwdind.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':"&nbsp;&#x25BE;",void this.appendChild(sortfwdind);theadrow=this.parentNode,forEach(theadrow.childNodes,function(t){1==t.nodeType&&(t.className=t.className.replace("sorttable_sorted_reverse",""),t.className=t.className.replace("sorttable_sorted",""))}),sortfwdind=document.getElementById("sorttable_sortfwdind"),sortfwdind&&sortfwdind.parentNode.removeChild(sortfwdind),sortrevind=document.getElementById("sorttable_sortrevind"),sortrevind&&sortrevind.parentNode.removeChild(sortrevind),this.className+=" sorttable_sorted",sortfwdind=document.createElement("span"),sortfwdind.id="sorttable_sortfwdind",sortfwdind.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':"&nbsp;&#x25BE;",this.appendChild(sortfwdind),row_array=[],col=this.sorttable_columnindex,rows=this.sorttable_tbody.rows;for(var e=0;e<rows.length;e++)row_array[row_array.length]=[sorttable.getInnerText(rows[e].cells[col]),rows[e]];row_array.sort(this.sorttable_sortfunction),tb=this.sorttable_tbody;for(var e=0;e<row_array.length;e++)tb.appendChild(row_array[e][1]);delete row_array}))}},guessType:function(t,e){sortfn=sorttable.sort_alpha;for(var o=0;o<t.tBodies[0].rows.length;o++)if(text=sorttable.getInnerText(t.tBodies[0].rows[o].cells[e]),""!=text){if(text.match(/^-?[�$�]?[\d,.]+%?$/))return sorttable.sort_numeric;if(possdate=text.match(sorttable.DATE_RE),possdate){if(first=parseInt(possdate[1]),second=parseInt(possdate[2]),first>12)return sorttable.sort_ddmm;if(second>12)return sorttable.sort_mmdd;sortfn=sorttable.sort_ddmm}}return sortfn},getInnerText:function(t){if(!t)return"";if(hasInputs="function"==typeof t.getElementsByTagName&&t.getElementsByTagName("input").length,null!=t.getAttribute("sorttable_customkey"))return t.getAttribute("sorttable_customkey");if(void 0!==t.textContent&&!hasInputs)return t.textContent.replace(/^\s+|\s+$/g,"");if(void 0!==t.innerText&&!hasInputs)return t.innerText.replace(/^\s+|\s+$/g,"");if(void 0!==t.text&&!hasInputs)return t.text.replace(/^\s+|\s+$/g,"");switch(t.nodeType){case 3:if("input"==t.nodeName.toLowerCase())return t.value.replace(/^\s+|\s+$/g,"");case 4:return t.nodeValue.replace(/^\s+|\s+$/g,"");break;case 1:case 11:for(var e="",o=0;o<t.childNodes.length;o++)e+=sorttable.getInnerText(t.childNodes[o]);return e.replace(/^\s+|\s+$/g,"");break;default:return""}},reverse:function(t){newrows=[];for(var e=0;e<t.rows.length;e++)newrows[newrows.length]=t.rows[e];for(var e=newrows.length-1;e>=0;e--)t.appendChild(newrows[e]);delete newrows},sort_numeric:function(t,e){return aa=parseFloat(t[0].replace(/[^0-9.-]/g,"")),isNaN(aa)&&(aa=0),bb=parseFloat(e[0].replace(/[^0-9.-]/g,"")),isNaN(bb)&&(bb=0),aa-bb},sort_alpha:function(t,e){return t[0]==e[0]?0:t[0]<e[0]?-1:1},sort_ddmm:function(t,e){return mtch=t[0].match(sorttable.DATE_RE),y=mtch[3],m=mtch[2],d=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt1=y+m+d,mtch=e[0].match(sorttable.DATE_RE),y=mtch[3],m=mtch[2],d=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt2=y+m+d,dt1==dt2?0:dt1<dt2?-1:1},sort_mmdd:function(t,e){return mtch=t[0].match(sorttable.DATE_RE),y=mtch[3],d=mtch[2],m=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt1=y+m+d,mtch=e[0].match(sorttable.DATE_RE),y=mtch[3],d=mtch[2],m=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt2=y+m+d,dt1==dt2?0:dt1<dt2?-1:1},shaker_sort:function(t,e){for(var o=0,a=t.length-1,s=!0;s;){s=!1;for(var r=o;r<a;++r)if(e(t[r],t[r+1])>0){var n=t[r];t[r]=t[r+1],t[r+1]=n,s=!0}if(a--,!s)break;for(var r=a;r>o;--r)if(e(t[r],t[r-1])<0){var n=t[r];t[r]=t[r-1],t[r-1]=n,s=!0}o++}}},document.addEventListener&&document.addEventListener("DOMContentLoaded",sorttable.init,!1),/WebKit/i.test(navigator.userAgent))var _timer=setInterval(function(){/loaded|complete/.test(document.readyState)&&sorttable.init()},10);window.onload=sorttable.init,dean_addEvent.guid=1,fixEvent.preventDefault=function(){this.returnValue=!1},fixEvent.stopPropagation=function(){this.cancelBubble=!0},Array.forEach||(Array.forEach=function(t,e,o){for(var a=0;a<t.length;a++)e.call(o,t[a],a,t)}),Function.prototype.forEach=function(t,e,o){for(var a in t)void 0===this.prototype[a]&&e.call(o,t[a],a,t)},String.forEach=function(t,e,o){Array.forEach(t.split(""),function(a,s){e.call(o,a,s,t)})};var forEach=function(t,e,o){if(t){var a=Object;if(t instanceof Function)a=Function;else{if(t.forEach instanceof Function)return void t.forEach(e,o);"string"==typeof t?a=String:"number"==typeof t.length&&(a=Array)}a.forEach(t,e,o)}};