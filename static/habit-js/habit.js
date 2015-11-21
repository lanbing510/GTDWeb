	$(document).ready(function(){
		var modify_status=false;

		var habit_ids=$("#habit_ids").text().split(",")

		var totalHabitsNumbers=habit_ids.length-1;
		var habits=new Array();
		var habits_value=new Array();
		var recorded_dates=new Array();
		var jsGlanceyears=new Array();


		for(var i=0;i<totalHabitsNumbers;i++)
		{
			var id=habit_ids[i].replace(/[\r\n\s]/g, "");
			habits.push("#habit"+id);
			habits_value.push("#habit"+id+"_value");
			recorded_dates.push("#recorded_dates"+id);
			jsGlanceyears.push("#js-glanceyear"+id);
		}

		habits.push("#habit");
		recorded_dates.push("#recorded_dates")
		jsGlanceyears.push("#js-glanceyear");


		// -----------------------------------------------For date-----------------------------------------
		$("#date").val($("#date_show").text())


		// --------------------------------------------For glanceyear--------------------------------------
		for(var h=0;h<totalHabitsNumbers+1;h++)
		{
			var rd=$(recorded_dates[h]).text()
			var rdl=rd.split(" ")
			rdl.pop()

			var massive=new Array()
			for(var i=0;i<rdl.length;i++){
				var rdll=rdl[i].split(":")
				massive.push({date:rdll[0],value:rdll[1]})
			}
		
			$(jsGlanceyears[h]).empty().glanceyear(
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
					},
					showToday: false
				}
			);
		}

		//---------------------------------------- Response for django----------------------------------
	   	// Count today is the ?th day 
		var countDays = function (date) {
    		date = date.split('/'); 
    		var year  = parseInt(date[0], 10);
    		date = (new Date(date)).getTime();
    		var initial = (new Date(year + '-1-1')).getTime();
    		var offset = date - initial;
    		return Math.floor(offset / 24 / 3600 / 1e3) + 1;
    	};

	    if($("#request_get_from").text()=="" || $("#request_get_from").text()==0||$("#request_get_from").text()==2||$("#request_get_from").text()==3){
	    	modify_status=false;
	    	$("#modify").hide();
	    	$("#submit").show();

	    	var today=new Date();
			var m=today.getMonth()+1;
			var w=today.getDay();  
			var d=today.getDate();
			if(w==1||w<=$("#w_count").html()){ // new week
				if($("#excepts").text()=="1"){
					$("#w_count").html("0")
				}
			}
			if(d==1||d<=$("#m_count").html()){ // New Month
				if($("#excepts").text()=="1"){
					$("#m_count").html("0")
				}
			}
			if((m==1 && d==1)||countDays(today.toLocaleDateString())<=$("#y_count").html()){ // New year
				if($("#excepts").text()=="1"){
					$("#y_count").html("0")
				}
			}
			
			if($("#request_get_from").text()=="" || $("#request_get_from").text()==0){
				if($("#excepts").text()=="0"){
					change2ModifyModel();
				}
				else
				{
					for(var i=0;i<totalHabitsNumbers;i++){
						$(habits[i]).attr("checked",false);
					}
				}
			}

			restoreCheckboxStatus();

			if($("#excepts").text()=="3"){
				alert("你添加了一个曾经添加过的习惯");
			}
			else if($("#excepts").text()=="4"){
				alert("没有你要删除的习惯，请坚持名字是否输入正确");
			}
		}
		else if($("#request_get_from").text()==1){
			change2ModifyModel();
			restoreCheckboxStatus();
		}


		function change2ModifyModel(){
			modify_status=true
			$("#modify").show();
			$("#submit").hide();
			disableCheckboxs(true);
		}

		function restoreCheckboxStatus(){
			for(var i=0;i<totalHabitsNumbers;i++){
				if($(habits_value[i]).text()==0){
					$(habits[i]).attr("checked",false);
				}
				else{
					$(habits[i]).attr("checked",true);
				}
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
			checkCheckboxs();
			disableCheckboxs(true);

			var habits_string="";
			for(var i=0;i<totalHabitsNumbers;i++){
				var id=habit_ids[i].replace(/[\r\n\s]/g, "");
				habits_string=habits_string+id+":"+$(habits[i]).val()+" ";
			}

			if(totalHabitsNumbers<1){
				alert("请先添加一个习惯");
			}


			$.post('/habit/',{
				'date':$("#date").val(),
				'weekday':$("#weekday").text(),
				'total_days':$("#total_days").text(),
				'habits_string':habits_string,
				'y_count':$("#y_count").text(),
				'm_count':$("#m_count").text(),
				'w_count':$("#w_count").text(),
			},function(data,textStatus){
				if(textStatus=="success"){
					window.location.reload();
				}
			});
		});


		//Function for add
		$("#add").click(function(){
			$.post('/habit/',{
				'addremove':1,
				'habit_name':$("#habit_addremove").val(),
			},function(data,textStatus){
				if(textStatus=="success"){
					window.location.reload();
				}
			});
		});


		//Function for remove
		$("#remove").click(function(){
			$.post('/habit/',{
				'addremove':0,
				'habit_name':$("#habit_addremove").val(),
			},function(data,textStatus){
				if(textStatus=="success"){
					window.location.reload();
				}
			});
		});


		//Function for modify
		$("#modify").click(function(){
			disableCheckboxs(false);

			modify_status=false;
			$("#modify").hide();
	    	$("#submit").show();

	    	$("#total_days").html((Number($("#total_days").text())-1).toString())
	    	$("#t_count").html((Number($("#t_count").text())-1).toString())
	    	$("#y_count").html((Number($("#y_count").text())-1).toString())
	    	$("#m_count").html((Number($("#m_count").text())-1).toString())
	    	$("#w_count").html((Number($("#w_count").text())-1).toString())

	    	updateShowBar()

		});

		//Function For Checkboxs
		function checkCheckboxs(){
			for(var i=0;i<totalHabitsNumbers;i++){
				if($(habits[i]).is(":checked")==false){
					$(habits[i]).val("0")
				}
				else{
					$(habits[i]).val("1")
				}
			}
		}
		function disableCheckboxs(eb){
			if(eb){
				for(var i=0;i<totalHabitsNumbers;i++){
					$(habits[i]).attr("disabled",true);
				}
			}
			else{
				for(var i=0;i<totalHabitsNumbers;i++){
					$(habits[i]).removeAttr("disabled");
				}
			}
		}


		$("#w_svg").mouseover(function(){
			//TODO
		});

	});