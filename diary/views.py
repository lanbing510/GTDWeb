# -*- coding: UTF-8 -*-

from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from diary.models import Diary

import datetime

request_get_from=0
history=""

# Create your views here.
@csrf_exempt
def diary(request):
	global request_get_from;
	global history;

	date="";
	weekday="";
	total_days=0;
	editor0="";
	editor1="";
	editor2="";
	editor3="";
	editor4="";
	editor5="";
	editor6="";
	editor7="";
	editor8="";
	y_count=0;
	m_count=0;
	w_count=0;
	total_count=0;
	excepts=0;
	recorded_dates="";


	weekday_array=["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"]

	if request.method=="POST":
		if request.POST.get('history')==None:
			date=request.POST['date']
			weekday=request.POST['weekday']
			total_days=str(int(request.POST['total_days'])+1)
			editor0=request.POST['eidtor0']
			editor1=request.POST['eidtor1']
			editor2=request.POST['eidtor2']
			editor3=request.POST['eidtor3']
			editor4=request.POST['eidtor4']
			editor5=request.POST['eidtor5']
			editor6=request.POST['eidtor6']
			editor7=request.POST['eidtor7']
			editor8=request.POST['eidtor8']
			y_count=str(int(request.POST['y_count'])+1)
			m_count=str(int(request.POST['m_count'])+1)
			w_count=str(int(request.POST['w_count'])+1)
			d=Diary(date=date,weekday=weekday,total_days=total_days,editor0=editor0,editor1=editor1,\
				editor2=editor2,editor3=editor3,editor4=editor4,editor5=editor5,editor6=editor6,\
				editor7=editor7,editor8=editor8,y_count=y_count,m_count=m_count,w_count=w_count)
			d.save()
			request_get_from=1;
		else:
			history=request.POST.get('history')
			request_get_from=2;

		#return HttpResponseRedirect('/diary/history/')

	if request.method=="GET":
		recorded_dates=getRecordedDates()
		if request_get_from==1:
			request_get_from=0

			today=getToday()
			(date,weekday,total_days,editor0,editor1,editor2,editor3,editor4,editor5,editor6,editor7,editor8,y_count,m_count,w_count,excepts)=getHistoryDiaryRecord(today)
			weekday=weekday_array[datetime.date.today().weekday()]
			total_count=getTotalCount(date)
			return  render_to_response('diary.html',{'request_get_from':1,'date':date,'weekday':weekday,'total_days':total_days,\
				'y_count':y_count,'m_count':m_count,'w_count':w_count,'editor0':editor0,'editor1':editor1,\
				'editor2':editor2,'editor3':editor3,'editor4':editor4,'editor5':editor5,'editor6':editor6,\
				'editor7':editor7,'editor8':editor8,'total_count':total_count,'recorded_dates':recorded_dates})
		elif request_get_from==2:
			request_get_from=0

			(date,weekday,total_days,editor0,editor1,editor2,editor3,editor4,editor5,editor6,editor7,editor8,y_count,m_count,w_count,excepts)=getHistoryDiaryRecord(history)
			total_count=getTotalCount(history)
			return  render_to_response('diary.html',{'request_get_from':2,'date':history,'weekday':weekday,'total_days':total_days,\
				'y_count':y_count,'m_count':m_count,'w_count':w_count,'editor0':editor0,'editor1':editor1,\
				'editor2':editor2,'editor3':editor3,'editor4':editor4,'editor5':editor5,'editor6':editor6,\
				'editor7':editor7,'editor8':editor8,'total_count':total_count,'excepts':excepts,'recorded_dates':recorded_dates})
		else:
			request_get_from=0

			today=getToday()
			(date,weekday,total_days,editor0,editor1,editor2,editor3,editor4,editor5,editor6,editor7,editor8,y_count,m_count,w_count,excepts)=getHistoryDiaryRecord(today)
			weekday=weekday_array[datetime.date.today().weekday()]
			if excepts==1:
				(date,total_days,editor0,editor1,editor2,y_count,m_count,w_count,excepts)=getLastDirayRecord()
				excepts+=1
				if date!="":
					dt=date.encode('UTF-8')
					last_day=datetime.date(int(dt[0:4]),int(dt[7:9]),int(dt[12:14]))
					diff_days=(datetime.date.today()-last_day).days
					if diff_days>=365:
						eidtor0=""
						editor1=""
						editor2=""
						y_count=0
						m_count=0
						w_count=0
					elif diff_days>=28:
						editor1=""
						editor2=""
						m_count=0
						w_count=0
					elif diff_days>=7:
						editor2=""
						w_count=0
					else:
						pass
			total_count=getTotalCount(today)
			return render_to_response('diary.html',{'request_get_from':0,'date':today,'weekday':weekday,'total_days':total_days,\
				'y_count':y_count,'m_count':m_count,'w_count':w_count,'editor0':editor0,'editor1':editor1,\
				'editor2':editor2,'editor3':editor3,'editor4':editor4,'editor5':editor5,'editor6':editor6,\
				'editor7':editor7,'editor8':editor8,'total_count':total_count,'excepts':excepts,'recorded_dates':recorded_dates})
	return  render_to_response('diary.html')



def getHistoryDiaryRecord(dt):
	date="";
	weekday="";
	total_days=0;
	editor0="";
	editor1="";
	editor2="";
	editor3="";
	editor4="";
	editor5="";
	editor6="";
	editor7="";
	editor8="";
	y_count=0;
	m_count=0;
	w_count=0;
	excepts=0;
	try:
		dy=Diary.objects.get(date=dt)
		date=dy.date
		weekday=dy.weekday
		total_days=dy.total_days
		editor0=dy.editor0
		editor1=dy.editor1
		editor2=dy.editor2
		editor3=dy.editor3
		editor4=dy.editor4
		editor5=dy.editor5
		editor6=dy.editor6
		editor7=dy.editor7
		editor8=dy.editor8
		y_count=dy.y_count
		m_count=dy.m_count
		w_count=dy.w_count
	except Exception,e:
		excepts=1
	return (date,weekday,total_days,editor0,editor1,editor2,editor3,editor4,editor5,editor6,editor7,editor8,y_count,m_count,w_count,excepts)


def getLastDirayRecord():
	date="";
	total_days=0;
	editor0="";
	editor1="";
	editor2="";
	y_count=0;
	m_count=0;
	w_count=0;
	excepts=0
	try:
		dy=Diary.objects.order_by("-date")[0]
		date=dy.date
		total_days=dy.total_days
		editor0=dy.editor0
		editor1=dy.editor1
		editor2=dy.editor2
		y_count=dy.y_count
		m_count=dy.m_count
		w_count=dy.w_count
	except Exception,e:
		excepts=1
	return (date,total_days,editor0,editor1,editor2,y_count,m_count,w_count,excepts)

def getTotalCount(ld):
	try:
		dy=Diary.objects.order_by("date")[0]
		dt=dy.date.encode('UTF-8')
		first_day=datetime.date(int(dt[0:4]),int(dt[7:9]),int(dt[12:14]))
		ld=ld.encode('UTF-8')
		last_day=datetime.date(int(ld[0:4]),int(ld[7:9]),int(ld[12:14]))
		total_count=(last_day-first_day).days
		return total_count+1
	except Exception,e:
		return 0
		

def getToday():
	td=str(datetime.date.today())
	td=td.split('-')
	return (td[0]+u'年'+td[1]+u'月'+td[2]+u'日')

def formatDate(dt):
	dt=dt.encode('UTF-8')
	fdt=dt[0:4]
	fdt+='-'
	if dt[7:8]=='0':
		fdt+=dt[8:9]
	else:
		fdt+=dt[7:9]
	fdt+='-'
	if dt[12:13]=='0':
		fdt+=dt[13:14]
	else:
		fdt+=dt[12:14]
	return fdt


def getRecordedDates():
	recorded_dates=""
	diary_list=Diary.objects.all()
	for dl in diary_list:
		recorded_dates+=formatDate(dl.date)+" "
	return recorded_dates



