/**
* Collate Display
* Using MITHGrid to take CollateX JSON output and display 
* in HTML-dynamic format
* Running jQuery ajax calls to remote collatex web service
*/
(function($, MITHGrid) {
	MITHGrid.Presentation.namespace("WitnessTable");
	MITHGrid.Presentation.WitnessTable = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("WitnessTable", container, options);
		return that;
	};
	
	MITHGrid.Presentation.namespace('AlignmentTable');
	MITHGrid.Presentation.AlignmentTable = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("AlignmentTable", container, options);
		return that;
	};
	
	MITHGrid.Application.namespace('CollateX');
	MITHGrid.Application.CollateX.initApp = function(container, options) {
		var that = MITHGrid.Application.initApp("MITHGrid.Application.CollateX", container, $.extend(true, {}, options, {
			dataStores: {
				collation: {
					types: {
						alignment: {},
						witness: {},
						token: {}
					},
					properties: {
						witnesses: {
							valueType: "Item" 
						},
						tokens: {
							valueType: "Item"
						}
					}
				}
			}, 
			// Right now, only looking at witnesses - create 
			// additional views and presentations to expand 
			// possible output areas
			dataViews: {
				alignmentView: {
					dataStore: "collation",
					types: ["alignment"]
				},
				witnessView: {
					dataStore: "collation",
					types: ["witness"]
				}
			},
			viewSetup: '<div id="collatexdisplay">'+
			'<div class="alignment_table"></div>'+
			'<div class="witness_table"></div>'+
			'</div>'+
			'<div id="textCorpus">'+
			'<button id="addTextArea">+Text Area</button>'+
			'</div>'+
			'<button id="collatethis">Collation Start</button>',
			presentations: {
				WitnessTable: {
					type: MITHGrid.Presentation.WitnessTable,
					dataView: 'witnessView',
					container: '#collatexdisplay > .witness_table',
					lenses: {
						witness: function(container, view, model, itemId) {
							var that = {},
							el, str,
							item = model.getItem(itemId);
							if(console) console.log('witness  '+ JSON.stringify(item.tokens));
							
							str = '<div id="'+item.id+'" class="witness"><h3>'+item.id+'</h3>';
							
							
							$.each(item.tokens, function(i, o) {
								str += '<p>'+o.n+'</p>';
							});
							str += '</div>';
							el = $(str);
							$(container).append(el);
						}
					}
				}, 
				
				AlignmentTable: {
					type: MITHGrid.Presentation.AlignmentTable,
					dataView: 'alignmentView',
					container: "#collatexdisplay > .alignment_table",
					lenses: {
						alignment: function(container, view, model, itemId) {
							var that = {},
							el,
							item = model.getItem(itemId);
							if(console) console.log('alignment'+ item);
							$(container).text(JSON.stringify(item));
						}
					}
				}
			}
			// end of MITHGrid CollateX App
			})), 
			// URL for CollateX web service
			collateWebUri = 'http://107.20.241.32:8080/collatex-web-0.9/api/collate',
			// goes out and grabs 
			// CollateX data 
			// @corpus is the JSON-based 
			// text
			getAlignment = function(corpus) {
				// send jQuery AJAX headers to the 
				// saved URI
				$.ajax({
					type: "POST",
					url: 'collateweb.php',
					dataType: 'json',
					data: {'witnesses': JSON.stringify(corpus)},
					success:function(data) {
						// go through and parse out the JSON data that
						// is returned
						var align = data.alignment;
						
			
						
						$.each(align, function(i, o) {
							if(o === null) return;
							o.type = 'witness';
							o.id = 'w'+i;
							$.each(o.tokens, function(x, y) {
								y.id = 't'+x;
								y.type = 'token';
							});
						});
					
						that.dataStore.collation.loadItems(align);
					}
				});
			},
			addTextArea = function() {
				// add textarea element
				// to textCorpus
				if(console) console.log('click');
				var id = $("#textCorpus > textarea").size;
				$("#textCorpus").append('<textarea id="'+id+'" />');
			};
				
				// $.ajax({
				// 					url: collateWebUri,
				// 					type: "POST",
				// 					contentType: 'application/json',
				// 					data: {"witnesses": corpus},
				// 					dataType: 'json',
				// 					success: function(json) {
				// 						if(console) console.log('success '+json);
				// 						// Returns JSON data specified from API
				// 						// Add this to the dataStore collation
				// 						that.dataStore.collation.loadItems(json);
				// 					}
				// 
				// 				});
			

			that.ready(function() {
				$("#collatethis").click(function(e) {
					e.preventDefault();
					if($("#textCorpus > textarea").size === 0) {
						return;
					}
					// construct witness array - each item has number ID and 
					// the content of the textarea
					var witnesses = [];
					
					// pull text from the textareas 
					$("#textCorpus > textarea").each(function(i, o) {
						var txt = $(o).val();
						if(/[A-Za-z0-9]*/.test(txt)) {
							var item = {
								id: i,
								content: txt
							};
							witnesses.push(item);
						}
					});
					// send to the WEB API
					getAlignment(witnesses);
				});
				
				// button click event for the text area
				$("#addTextArea").click(function(e) {
					if(console) console.log('button clikc');
					addTextArea();
				});
 			});
			
			
			
			return that;
	};
})(jQuery, MITHGrid);