chrome.contextMenus.onClicked.addListener((function(e){switch(e.menuItemId){case"radio":console.log("Radio item clicked. Status:",e.checked);break;case"checkbox":console.log("Checkbox item clicked. Status:",e.checked);break;default:console.log("Standard context menu item clicked.")}})),console.log("running right click function"),chrome.runtime.onInstalled.addListener((function(){let e=["page","selection","link","editable","image","video","audio"];for(let t=0;t<e.length;t++){let c=e[t],o="Test '"+c+"' menu item";chrome.contextMenus.create({title:o,contexts:[c],id:c})}let t=chrome.contextMenus.create({title:"Test parent item",id:"parent"});chrome.contextMenus.create({title:"Child 1",parentId:t,id:"child1"}),chrome.contextMenus.create({title:"Child 2",parentId:t,id:"child2"}),chrome.contextMenus.create({title:"radio",type:"radio",id:"radio"}),chrome.contextMenus.create({title:"checkbox",type:"checkbox",id:"checkbox"}),chrome.contextMenus.create({title:"Oops",parentId:999,id:"errorItem"},(function(){chrome.runtime.lastError&&console.log("Got expected error: "+chrome.runtime.lastError.message)}))}));
//# sourceMappingURL=rightClick.js.map