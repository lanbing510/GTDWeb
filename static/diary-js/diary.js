	$(document).ready(function(){
		var totalEditorsNumbers=9;
		var current_id=3;
		var modify_status=false;

		var txtEditors=new Array("#txtEditor0","#txtEditor1","#txtEditor2","#txtEditor3","#txtEditor4","#txtEditor5","#txtEditor6","#txtEditor7","#txtEditor8");
		var toggles=new Array("#toggle0","#toggle1","#toggle2","#toggle3","#toggle4","#toggle5","#toggle6","#toggle7","#toggle8");
		var firstFocus=new Array(true,true,true,true,true,true,true,true,true);

		var svgs=new Array("#t_svg","#y_svg","#m_svg","#w_svg");
		var svg_counts=new Array("#t_count","#y_count","#m_count","#w_count");

		// -----------------------------------------------For date-----------------------------------------
		$("#date").val($("#date_show").text())

		$(function(){
			$("#date").datepicker({
				dateFormat:"yy年mm月dd日",
				changeMonth:true,
				numberOfMonths: 2,
			});
			
		});

		$("#date").change(function(){
			$.post('/diary/',{
				'history':$("#date").val(),
			},function(data,textStatus){
				if(textStatus=="success"){
					window.location.reload();
				}
			});
		});


		// ----------------------------------------------For editors---------------------------------------
		// Create editors
		for(var i=0;i<totalEditorsNumbers;i++){
			$(txtEditors[i]).Editor();
		}

		// Hide menubars and statusbars
		$(document).find("div#menuBarDiv").slideToggle();
		$(document).find("div#statusbar").slideToggle();

		// Bind toggle menus
		for(var i=0;i<totalEditorsNumbers;i++){
			$(toggles[i]).click(function(e){
				var tis=$(this).parent().parent().parent();
				tis.find("div#menuBarDiv").slideToggle();
				tis.find("div#statusbar").slideToggle();

				if($(this).hasClass("dropdown")){
					$(this).removeClass("dropdown");
					$(this).addClass("dropup");
				}
				else{
					$(this).removeClass("dropup");
					$(this).addClass("dropdown");
				}
			});
		}

		// Focus and insert 
		function prepareForWrite(){
			if(current_id==totalEditorsNumbers){
				current_id=3;
			}

			document.getElementsByClassName("Editor-editor")[current_id].focus();

			var ediable=$(txtEditors[current_id]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable")

			if(firstFocus[current_id]==true && ediable=="true"){
				line_count=0;
				firstFocus[current_id]=false;
				document.execCommand("insertorderedlist",false,null);	
			}
			current_id+=1;
		}

		// Bind shortcuts blabla
		$(document).bind("keydown.Ctrl_m",function(e){
			prepareForWrite();
			current_id-=1;
		});
		$(".Editor-editor").bind("keydown.Ctrl_m",function(){
			prepareForWrite();
		});


		$(".Editor-editor").click(function(){
			current_id=Number($(this).parent().parent().children("div.editor-idx").text());
			prepareForWrite();
			if(current_id<3){
				current_id=3;
			}
		});
		$(".Editor-editor").dblclick(function(){
	    	if(modify_status==false){
    			var i=Number($(this).parent().parent().children("div.editor-idx").text());
	    		$(txtEditors[i]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",true);
	    	}
	    });


        // Increase/decrease the height of th eidtor when needed.
	    $(".Editor-editor").keyup(function(event){
	    	var line_count;
	       	var keyCode=event.keyCode?event.keyCode:event.which?event.which:event.charCode;
	       	if(keyCode==13 || keyCode==8){//Enter or Backspace
	       		line_count=$(this).children().children("li").length+$(this).children("div").length+$(this).children("p").length*1.4+$(this).children("br").length;
	       		if(line_count>5){
	       			var current_height=(180+25*(line_count-5)).toString()+"px";
	       			$(this).css("height",current_height);
	       			//$(this).attr("contenteditable",false);
	       		}
	       		else{
	       			$(this).css("height","180px");
	       		}
	       	}
	    });

	    // Change to modify model
		function change2ModifyModel(){
			modify_status=true
			$("#modify").show();
			$("#submit").hide();
			
			for(var i=0;i<totalEditorsNumbers;i++){
				var content="";
				if($(txtEditors[i]).text().length!=2){
					content=$(txtEditors[i]).text();
					firstFocus[i]=false;
				}
				$(txtEditors[i]).Editor('setText',content);
				adjustEditorHeight(txtEditors[i]);
	    		$(txtEditors[i]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",false);
			}
		}

		// Adjust the height of the eidtor
		function adjustEditorHeight(edi){
			var E=$(edi).parent().children("div.Editor-container").children("div.Editor-editor");
			var line_count=E.children().children("li").length+$(this).children("div").length+$(this).children("p").length*1.4+$(this).children("br").length
	       	if(line_count>5){
	       		var current_height=(180+25*(line_count-5)).toString()+"px";
	       		E.css("height",current_height);
	       	}
	       	else{
	       		E.css("height","180px");
	       	}
		}

		// Count today is the ?th day 
		var countDays = function (date) {
    		date = date.split('/'); 
    		var year  = parseInt(date[0], 10);
    		date = (new Date(date)).getTime();
    		var initial = (new Date(year + '-1-1')).getTime();
    		var offset = date - initial;
    		return Math.floor(offset / 24 / 3600 / 1e3) + 1;
    	};

		// Editor content
	    if($("#request_get_from").text()=="" || $("#request_get_from").text()==0){
	    	modify_status=false;
	    	$("#modify").hide();
	    	$("#submit").show();

	    	var today=new Date();
			var m=today.getMonth()+1;
			var w=today.getDay();  
			var d=today.getDate();

			if(w==0){
				w=7;
			}
			
			if(w==1||w<=$("#w_count").html()){ // new week
				if($("#excepts").text()=="1"){
					$("#w_count").html("0")
				}
				$(txtEditors[2]).Editor('setText',"");
	    		$(txtEditors[2]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",true);
			}
			else{
				var content="";
				if($("#txtEditor2").text().length!=2){
					content=$("#txtEditor2").text();
					firstFocus[2]=false;
				}
				$(txtEditors[2]).Editor('setText',content);
				adjustEditorHeight(txtEditors[2]);
	    		$(txtEditors[2]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",false);
			}
			if(d==1||d<=$("#m_count").html()){ // New Month
				if($("#excepts").text()=="1"){
					$("#m_count").html("0")
				}
				$(txtEditors[1]).Editor('setText',"");
	    		$(txtEditors[1]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",true);
			}
			else{
				var content="";
				if($("#txtEditor1").text().length!=2){
					content=$("#txtEditor1").text();
					firstFocus[1]=false;
				}
				$(txtEditors[1]).Editor('setText',content);
				adjustEditorHeight(txtEditors[1]);
	    		$(txtEditors[1]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",false);
			}
			if((m==1 && d==1)||countDays(today.toLocaleDateString())<=$("#y_count").html()){ // New year
				if($("#excepts").text()=="1"){
					$("#y_count").html("0")
				}
				$(txtEditors[0]).Editor('setText',"");
	    		$(txtEditors[0]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",true);
			}
			else{
				var content="";
				if($("#txtEditor0").text().length!=2){
					content=$("#txtEditor0").text();
					firstFocus[0]=false;
				}
				$(txtEditors[0]).Editor('setText',content);
				adjustEditorHeight(txtEditors[0]);
	    		$(txtEditors[0]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",false);
			}

			if($("#excepts").text()=="0"){
				change2ModifyModel();
			}
		}
		else if($("#request_get_from").text()==1){
			change2ModifyModel();
		}
		else if($("#request_get_from").text()==2 ){
			if($("#excepts").text()=="0"){
				change2ModifyModel();
			}
			else if($("#excepts").text()=="1"){
				alert("你所查询到记录不存在");
				window.location.reload();
			}		
		}

		// ----------------------------------------------For showbar----------------------------------------
		// Calculate path for svg
		var t_svg_path0,t_svg_path1,y_svg_path0,y_svg_path1,m_svg_path0,m_svg_path1,w_svg_path0,w_svg_path1;
		function updateShowBar(){
			$("#t_svg_circle").attr("fill","rgba(0,0,0,0.12)");
			$("#y_svg_circle").attr("fill","rgba(0,0,0,0.12)");
			$("#m_svg_circle").attr("fill","rgba(0,0,0,0.12)");
			$("#w_svg_circle").attr("fill","rgba(0,0,0,0.12)");

			var t_ncount=(Number($("#t_count").text()));
			var total_ncount=(Number($("#total_count").text()));
			t_ncount=t_ncount>total_ncount?total_ncount:t_ncount;
			if(t_ncount<total_ncount){
				var t_x=20+20*Math.sin(t_ncount/total_ncount*2*Math.PI);
				var t_y=20-20*Math.cos(t_ncount/total_ncount*2*Math.PI);
				if(t_ncount<total_ncount/2){
					t_svg_path0="M 20 0 A 20 20 0 0 1 "+t_x.toString()+" "+t_y.toString()+" L 20 20";
					$("#t_svg_path0").attr("d",t_svg_path0);
					$("#t_svg_path0").attr("fill","rgba(64,172,99,0.8)");

					$("#t_svg_path1").attr("d","");
					$("#t_svg_path1").attr("fill","");
				}
				else{
					$("#t_svg_path0").attr("d","M 20 0 A 20 20 0 0 1 20 40 L 20 20");
					$("#t_svg_path0").attr("fill","rgba(64,172,99,0.8)");				


					t_svg_path1="M 20 40 A 20 20 0 0 1 "+t_x.toString()+" "+t_y.toString()+" L 20 20";
					$("#t_svg_path1").attr("d",t_svg_path1);
					$("#t_svg_path1").attr("fill","rgba(64,172,99,0.8)");
				}
			}
			else{
				$("#t_svg_circle").attr("fill","rgba(215,78,78,0.5)");
				t_ncount=0;
			}

			var y_ncount=(Number($("#y_count").text()));
			y_ncount=y_ncount>365?365:y_ncount;
			if(y_ncount<365){
				var y_x=20+20*Math.sin(y_ncount/365.0*2*Math.PI);
				var y_y=20-20*Math.cos(y_ncount/365.0*2*Math.PI);
				if(y_ncount<365/2){
					y_svg_path0="M 20 0 A 20 20 0 0 1 "+y_x.toString()+" "+y_y.toString()+" L 20 20";
					$("#y_svg_path0").attr("d",y_svg_path0);
					$("#y_svg_path0").attr("fill","rgba(64,172,99,0.8)");

					$("#y_svg_path1").attr("d","");
					$("#y_svg_path1").attr("fill","");					
				}
				else{
					$("#y_svg_path0").attr("d","M 20 0 A 20 20 0 0 1 20 40 L 20 20");
					$("#y_svg_path0").attr("fill","rgba(64,172,99,0.8)");				


					y_svg_path1="M 20 40 A 20 20 0 0 1 "+y_x.toString()+" "+y_y.toString()+" L 20 20";
					$("#y_svg_path1").attr("d",y_svg_path1);
					$("#y_svg_path1").attr("fill","rgba(64,172,99,0.8)");
				}
			}
			else{
				$("#y_svg_circle").attr("fill","rgba(215,78,78,0.5)");
				y_ncount=0;
			}

			var m_ncount=(Number($("#m_count").text()));
			m_ncount=m_ncount>30?30:m_ncount;
			if(m_ncount<30){
				var m_x=20+20*Math.sin(m_ncount/30.0*2*Math.PI);
				var m_y=20-20*Math.cos(m_ncount/30.0*2*Math.PI);
				if(m_ncount<30/2){
					m_svg_path0="M 20 0 A 20 20 0 0 1 "+m_x.toString()+" "+m_y.toString()+" L 20 20";
					$("#m_svg_path0").attr("d",m_svg_path0);
					$("#m_svg_path0").attr("fill","rgba(64,172,99,0.8)");

					$("#m_svg_path1").attr("d","");
					$("#m_svg_path1").attr("fill","");
				}
				else{
					$("#m_svg_path0").attr("d","M 20 0 A 20 20 0 0 1 20 40 L 20 20");
					$("#m_svg_path0").attr("fill","rgba(64,172,99,0.8)");				


					m_svg_path1="M 20 40 A 20 20 0 0 1 "+m_x.toString()+" "+m_y.toString()+" L 20 20";
					$("#m_svg_path1").attr("d",m_svg_path1);
					$("#m_svg_path1").attr("fill","rgba(64,172,99,0.8)");
				}
			}
			else{
				$("#m_svg_circle").attr("fill","rgba(215,78,78,0.5)");
				m_ncount=0;
			}

			var w_ncount=(Number($("#w_count").text()));
			w_ncount=w_ncount>7?7:w_ncount;
			if(w_ncount<7){
				var w_x=20+20*Math.sin(w_ncount/7.0*2*Math.PI);
				var w_y=20-20*Math.cos(w_ncount/7.0*2*Math.PI);
				if(w_ncount<7/2){
					w_svg_path0="M 20 0 A 20 20 0 0 1 "+w_x.toString()+" "+w_y.toString()+" L 20 20";
					$("#w_svg_path0").attr("d",w_svg_path0);
					$("#w_svg_path0").attr("fill","rgba(64,172,99,0.8)");

					$("#w_svg_path1").attr("d","");
					$("#w_svg_path1").attr("fill","");
				}
				else{
					$("#w_svg_path0").attr("d","M 20 0 A 20 20 0 0 1 20 40 L 20 20");
					$("#w_svg_path0").attr("fill","rgba(64,172,99,0.8)");				


					w_svg_path1="M 20 40 A 20 20 0 0 1 "+w_x.toString()+" "+w_y.toString()+" L 20 20";
					$("#w_svg_path1").attr("d",w_svg_path1);
					$("#w_svg_path1").attr("fill","rgba(64,172,99,0.8)");
				}
			}
			else{
				$("#w_svg_circle").attr("fill","rgba(215,78,78,0.5)");
				w_ncount=0;
			}


		}
		updateShowBar();


		// -------------------------------------------For submit and modify----------------------------------
		// Function for submit
		$("#submit").click(function(){
			$.post('/diary/',{
				'date':$("#date").val(),
				'weekday':$("#weekday").text(),
				'total_days':$("#total_days").text(),
				'eidtor0':$(txtEditors[0]).Editor('getText'),
				'eidtor1':$(txtEditors[1]).Editor('getText'),
				'eidtor2':$(txtEditors[2]).Editor('getText'),
				'eidtor3':$(txtEditors[3]).Editor('getText'),
				'eidtor4':$(txtEditors[4]).Editor('getText'),
				'eidtor5':$(txtEditors[5]).Editor('getText'),
				'eidtor6':$(txtEditors[6]).Editor('getText'),
				'eidtor7':$(txtEditors[7]).Editor('getText'),
				'eidtor8':$(txtEditors[8]).Editor('getText'),
				'y_count':$("#y_count").text(),
				'm_count':$("#m_count").text(),
				'w_count':$("#w_count").text(),
			},function(data,textStatus){
				if(textStatus=="success"){
					window.location.reload();
					//window.location.href="/diary/history/";
				}
			});
		});

		//Function for modify
		$("#modify").click(function(){
			modify_status=false;
			$("#modify").hide();
	    	$("#submit").show();

	    	$("#total_days").html((Number($("#total_days").text())-1).toString())
	    	$("#t_count").html((Number($("#t_count").text())-1).toString())
	    	$("#y_count").html((Number($("#y_count").text())-1).toString())
	    	$("#m_count").html((Number($("#m_count").text())-1).toString())
	    	$("#w_count").html((Number($("#w_count").text())-1).toString())
	    	
	    	updateShowBar()

			for(var i=0;i<totalEditorsNumbers;i++){
	    		$(txtEditors[i]).parent().children("div.Editor-container").children("div.Editor-editor").attr("contenteditable",true);
	    		if($(txtEditors[i]).text().length!=2){
	    			firstFocus[i]=false;
	    		}
			}
		});



		// Function For Showing The Count When Mouse Move Over The SVGs
		function createElementSvg(type, prop ) {
			var e = document.createElementNS('http://www.w3.org/2000/svg', type);
			for (var p in prop) {
				e.setAttribute(p, prop[p]);
			}
			return e;
		}

		for(var i=0;i<svgs.length;i++)
		{
			var circleElement = createElementSvg('circle', {
				'id':'mouseover_on_c',
				'cx':"20",
				'cy':"20",
				'r':"15",
				'fill':"rgba(255,255,255,1)",       
			});
			var text = createElementSvg('text', {
				'id':'mouseover_on_t',
				'x':'20', 
				'y':'25', 
				'style':'font-size:14; fill:#000000; font-family:Times New Roman; text-anchor:middle;'
			});

			$(svgs[i]).attr('count',$(svg_counts[i]).text());

			$(svgs[i]).mouseover(function(){
				if($("#mouseover_on_c").length==0){
					$(this).append(circleElement);
					text.textContent = $(this).attr('count')
					$(this).append(text);
				}
			});

			$(svgs[i]).mouseleave(function(){
				if($("#mouseover_on_c").length>0){
					$("#mouseover_on_c").remove();
					$("#mouseover_on_t").remove();
				}
			});
		}


		// -------------------------------------------For glanceyear----------------------------------
		$("#glanceyear").hide()
		var glanceyear_show=false
		$("#toggle_glanceyear").click(function(){
			if(glanceyear_show){
				$("#glanceyear").hide()
				glanceyear_show=false
			}
			else{
				$("#glanceyear").show()
				glanceyear_show=true
			}

			if($(this).hasClass("dropdown")){
				$(this).removeClass("dropdown");
				$(this).addClass("dropup");
			}
			else{
				$(this).removeClass("dropup");
				$(this).addClass("dropdown");
			}

		});
		$(function() {
			var rd=$("#recorded_dates").text()
			var rdl=rd.split(" ")
			rdl.pop()

			var massive=new Array()
			for(var i=0;i<rdl.length;i++){
				massive.push({date:rdl[i],value:'1'})
			}
		
			$('#js-glanceyear').empty().glanceyear(
				massive,
				{
					eventClick: function(e) {
						dt=e.date
						dtl=dt.split('-')
						if(Number(dtl[1])<10){
							dtl[1]='0'+dtl[1]
						}
						if(Number(dtl[2])<10){
							dtl[2]='0'+dtl[2]
						}

						$.post('/diary/',{
							'history':dtl[0]+'年'+dtl[1]+'月'+dtl[2]+'日',
							},function(data,textStatus){
							if(textStatus=="success"){
								window.location.reload();
							}
						});
					},
					showToday: false
				}
			);
		});

	});