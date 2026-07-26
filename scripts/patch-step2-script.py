#!/usr/bin/env python3
"""
Insert Step 2 (LocalStorage history) logic into script.js.

script.js is a single minified IIFE. We make 2 surgical insertions:
  1. New history helper functions + init calls (inserted before final `})();`)
  2. Modify initSizeCalculator: store result on form, wire save button, render history
"""

import sys

PATH = r"d:\DevProject\breastcalculator\script.js"

NEW_HELPERS = r"""
function bcGetHistory(){try{var raw=localStorage.getItem('bc_measurement_history');if(!raw)return[];var arr=JSON.parse(raw);return Array.isArray(arr)?arr:[];}catch(e){return[];}}
function bcSetHistory(arr){try{localStorage.setItem('bc_measurement_history',JSON.stringify(arr));}catch(e){}}
function bcFormatHistoryDate(ts){try{var d=new Date(ts);var now=Date.now();var diff=now-ts;if(diff<60000)return'just now';if(diff<3600000)return Math.floor(diff/60000)+'m ago';if(diff<86400000)return Math.floor(diff/3600000)+'h ago';if(diff<604800000)return Math.floor(diff/86400000)+'d ago';var mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return mo[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();}catch(e){return'';}}
function bcEscapeHtml(s){if(s==null)return'';return String(s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
function bcRenderHistory(container,form){if(!container)return;var list=container.querySelector('#bc-history-list');if(!list)return;var items=bcGetHistory();items.sort(function(a,b){return b.ts-a.ts;});if(items.length===0){list.innerHTML='<li class="bc-history-empty">No saved measurements yet. Hit \"Save to My Profile\" after calculating to keep a record here — only stored in this browser.</li>';return;}var html='';for(var i=0;i<items.length;i++){var e=items[i];html+='<li class="bc-history-item" data-entry-id="'+bcEscapeHtml(e.id)+'">';html+='<div class="bc-history-item-main">';html+='<span class="bc-history-item-size">'+bcEscapeHtml(e.us||'—')+'</span>';html+='<div class="bc-history-item-meta">';html+='<span><span class="bc-meta-label">Saved</span> '+bcEscapeHtml(bcFormatHistoryDate(e.ts))+'</span>';if(e.uk) html+='<span><span class="bc-meta-label">UK</span> '+bcEscapeHtml(e.uk)+'</span>';if(e.eu) html+='<span><span class="bc-meta-label">EU</span> '+bcEscapeHtml(e.eu)+'</span>';if(e.unit) html+='<span><span class="bc-meta-label">Unit</span> '+bcEscapeHtml(e.unit)+'</span>';html+='</div></div>';html+='<div class="bc-history-item-actions">';html+='<button type="button" class="bc-history-btn bc-history-restore" data-action="restore">Restore</button>';html+='<button type="button" class="bc-history-btn bc-history-delete" data-action="delete">Delete</button>';html+='</div></li>';}list.innerHTML=html;}
function bcDeleteHistoryEntry(entryId){var items=bcGetHistory();var next=[];for(var i=0;i<items.length;i++){if(items[i].id!==entryId)next.push(items[i]);}bcSetHistory(next);}
function bcClearAllHistory(){var items=bcGetHistory();if(items.length===0)return false;if(!confirm('Remove all '+items.length+' saved measurement(s)? This cannot be undone.'))return false;bcSetHistory([]);return true;}
function bcSaveToHistory(form,result){if(!form||!result)return false;try{var items=bcGetHistory();var ubEl=form.querySelector('input[name="underbust"],#underbust');var bEl=form.querySelector('input[name="bust"],#bust');var unitEl=form.querySelector('#unit,[name="unit"]');var ub=ubEl?ubEl.value:'';var b=bEl?bEl.value:'';var unit=unitEl?unitEl.value:'';var dup=items.findIndex(function(x){return x.us===result.us&&String(x.ub)===String(ub)&&String(x.b)===String(b);});var id=dup>=0?items[dup].id:('entry_'+Date.now()+'_'+Math.random().toString(36).slice(2,8));var entry={id:id,ub:ub,b:b,unit:unit,bandSize:result.bandSize,cupLetter:result.cupLetter,us:result.us,uk:result.uk,eu:result.eu,fr:result.fr,au:result.au,india:result.india,cupDiff:result.cupDiff,ts:Date.now(),path:location.pathname};if(dup>=0){items[dup]=entry;}else{items.unshift(entry);}if(items.length>30)items=items.slice(0,30);bcSetHistory(items);return true;}catch(e){console.warn('[bc-history] save failed',e);return false;}}
function bcRestoreHistoryEntry(entryId,form){if(!form)return;var items=bcGetHistory();var entry=null;for(var i=0;i<items.length;i++){if(items[i].id===entryId){entry=items[i];break;}}if(!entry)return;try{var ubEl=form.querySelector('input[name="underbust"],#underbust');var bEl=form.querySelector('input[name="bust"],#bust');var unitEl=form.querySelector('#unit,[name="unit"]');if(ubEl&&entry.ub!=null)ubEl.value=entry.ub;if(bEl&&entry.b!=null)bEl.value=entry.b;if(unitEl&&entry.unit){var u=entry.unit;var map={'inch':'inches','inches':'inches','cm':'centimeters','centimeters':'centimeters','mm':'millimeters','millimeters':'millimeters'};unitEl.value=map[u]||u;try{unitEl.dispatchEvent(new Event('change'));}catch(_){}}if(window.showToast)window.showToast('Restored '+entry.us+' measurements','success');var list=document.querySelectorAll('.bc-history-item');for(var j=0;j<list.length;j++){if(list[j].getAttribute('data-entry-id')===entryId){list[j].classList.remove('bc-history-item-restored');void list[j].offsetWidth;list[j].classList.add('bc-history-item-restored');break;}}try{form.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(_){}}catch(e){console.warn('[bc-history] restore failed',e);if(window.showToast)window.showToast('Could not restore','error');}}
function bcWireHistory(form){if(!form||form.dataset.historyWired==='1')return;form.dataset.historyWired='1';var historyRoot=document.getElementById('bc-history');if(historyRoot){bcRenderHistory(historyRoot,form);var clearBtn=historyRoot.querySelector('#bc-history-clear');if(clearBtn){clearBtn.addEventListener('click',function(){if(bcClearAllHistory()){bcRenderHistory(historyRoot,form);if(window.showToast)window.showToast('All saved measurements cleared','info');}else{if(window.showToast)window.showToast('Nothing to clear','info');}});}historyRoot.addEventListener('click',function(ev){var btn=ev.target.closest('.bc-history-btn');if(!btn)return;var item=btn.closest('.bc-history-item');if(!item)return;var entryId=item.getAttribute('data-entry-id');var action=btn.getAttribute('data-action');if(action==='restore'){bcRestoreHistoryEntry(entryId,form);}else if(action==='delete'){if(!confirm('Remove this saved measurement?'))return;bcDeleteHistoryEntry(entryId);bcRenderHistory(historyRoot,form);if(window.showToast)window.showToast('Measurement removed','info');}});}}
function bcMarkSaved(saveBtn,label,result){if(!saveBtn)return;saveBtn.classList.add('is-saved');if(label)label.textContent='Saved as '+result.us;setTimeout(function(){if(saveBtn){saveBtn.classList.remove('is-saved');if(label)label.textContent='Save to My Profile';}},2200);}
function bcInitSaveButton(form){if(!form||form.dataset.saveInit==='1')return;form.dataset.saveInit='1';var saveBtn=form.parentElement&&form.parentElement.querySelector('#size-save');var labelEl=saveBtn?saveBtn.querySelector('#size-save-label'):null;if(saveBtn){saveBtn.addEventListener('click',function(ev){ev.preventDefault();var result=form.__lastResult;if(!result){if(window.showToast)window.showToast('Calculate your size first, then save.','info');return;}var ok=bcSaveToHistory(form,result);if(ok){bcMarkSaved(saveBtn,labelEl,result);var historyRoot=document.getElementById('bc-history');if(historyRoot)bcRenderHistory(historyRoot,form);if(window.showToast)window.showToast('Saved to your profile','success');}});}}
function bcBootStep2(){var forms=document.querySelectorAll('#size-form');forms.forEach(function(f){bcWireHistory(f);bcInitSaveButton(f);});}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',bcBootStep2);}else{bcBootStep2();}
"""

def replace_once(haystack, needle, replacement, label):
    count = haystack.count(needle)
    if count == 0:
        sys.stderr.write(f"[{label}] NOT FOUND: {needle[:80]}...\n")
        sys.exit(1)
    if count > 1:
        sys.stderr.write(f"[{label}] found {count} matches (need 1): {needle[:80]}...\n")
        sys.exit(1)
    return haystack.replace(needle, replacement, 1)

with open(PATH, 'r', encoding='utf-8') as f:
    src = f.read()

# 1) Insert helpers + boot just before the final `})();` of the IIFE
#    Use the last 5 chars `})();` at the end.
needle1 = "return false;}catch (e){return false;}}})();"
replacement1 = "return false;}catch (e){return false;}}" + NEW_HELPERS + "})();"
src = replace_once(src, needle1, replacement1, "end-iife")

# 2) Inside initSizeCalculator, after the result is set, store it and render history.
#    script.js's initSizeCalculator is simpler (no setTimeout/choice stage), so we hook
#    in just before the submit handler closes.
needle2 = "resultDiv.scrollIntoView({behavior:'smooth',block:'nearest'});});}function estimateBreastVolume"
replacement2 = "form.__lastResult=result;try{var __hr=document.getElementById('bc-history');if(__hr)bcRenderHistory(__hr,form);}catch(_){};resultDiv.scrollIntoView({behavior:'smooth',block:'nearest'});});}function estimateBreastVolume"
src = replace_once(src, needle2, replacement2, "initSizeCalc-end")

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(src)

print(f"[step2-script] Wrote {len(src)} chars to {PATH}")
