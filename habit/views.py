# -*- coding: UTF-8 -*-


from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from habit.models import Habit,HabitRecords

import datetime

request_get_from=0
history=""
habit_id=""
habit_name=""
habit_isnew=True

class HabitStructure(object):
	def __init__(self, id, name,value,recorded_dates):
		self.id = id
		self.name=name
		self.value=value
		self.recorded_dates=recorded_dates


# Create your views here.
@csrf_exempt
def habit(request):
	global request_get_from;
	global history;
	global habit_id;
	global habit_name;
	global habit_isnew;

	date="";
	weekday="";
	total_days=0;
	habits=[]
	habits_string=""
	y_count=0;
	m_count=0;
	w_count=0;
	total_count=0;
	excepts=0;
	recorded_dates="";

	weekday_array=["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"]

	if request.method=="POST":
		if request.POST.get('addremove')==None:
			date=request.POST['date']
			weekday=request.POST['weekday']
			
			habits_string=request.POST['habits_string']
			hbdic=getHabitsDict(habits_string)

			total_days=str(int(request.POST['total_days'])+1)
			y_count=str(int(request.POST['y_count'])+1)
			m_count=str(int(request.POST['m_count'])+1)
			w_count=str(int(request.POST['w_count'])+1)
			d=HabitRecords(date=date,weekday=weekday,total_days=total_days,habits_string=habits_string,y_count=y_count,m_count=m_count,w_count=w_count)
			d.save()
			
			if  d.habits.all() and len(d.habits.all())!=len(hbdic.keys()):
				total_days=str(int(request.POST['total_days']))
				y_count=str(int(request.POST['y_count']))
				m_count=str(int(request.POST['m_count']))
				w_count=str(int(request.POST['w_count']))
				d=HabitRecords(date=date,weekday=weekday,total_days=total_days,habits_string=habits_string,y_count=y_count,m_count=m_count,w_count=w_count)
				d.save()			

			for h in d.habits.all():
				d.habits.remove(h)

			for k in hbdic.keys():

				h=Habit.objects.get(id=int(k))
				d.habits.add(h)
				d.save()

			request_get_from=1;
		else:
			addremove=request.POST['addremove']
			habit_name=request.POST['habit_name']
			if addremove=='1': #Add
				max_id="-1"
				try:
					max_id=Habit.objects.order_by("-id")[0].id
				except Exception,e:
					print e	
				try:
					hb=Habit.objects.get(name=habit_name)
					habit_id=hb.id
					habit_isnew=False
				except: #数据库中没有此习惯
					max_id=int(max_id)
					habit_id=str(max_id+1)
					h=Habit(habit_id,habit_name)
					h.save()
				request_get_from=2
			else:
				request_get_from=3




	if request.method=="GET":
		#habits.append(HabitStructure(1,'早起',1,'2015年11月21日'))
		#habits.append(HabitStructure(2,'早起',1,'2015年11月21日'))

		if request_get_from==1:
			request_get_from=0
			today=getToday()
			(date,weekday,total_days,habits,y_count,m_count,w_count,excepts)=getHistoryHabitRecord(today)
			weekday=weekday_array[datetime.date.today().weekday()]
			total_count=getTotalCount(date)

			recorded_dates=getRecordedDates(habits)
			return  render_to_response('habit.html',{'request_get_from':1,'date':date,'weekday':weekday,'total_days':total_days,\
				'habits':habits,'y_count':y_count,'m_count':m_count,'w_count':w_count,'total_count':total_count,'recorded_dates':recorded_dates})
		else:
			addremove_flag=request_get_from
			request_get_from=0
			today=getToday()
			(date,weekday,total_days,habits,y_count,m_count,w_count,excepts)=getHistoryHabitRecord(today)
			weekday=weekday_array[datetime.date.today().weekday()]
			if excepts==1:
				(date,total_days,habits,y_count,m_count,w_count,excepts)=getLastDirayRecord()
				excepts+=1
				if date!="":
					dt=date.encode('UTF-8')
					last_day=datetime.date(int(dt[0:4]),int(dt[7:9]),int(dt[12:14]))
					diff_days=(datetime.date.today()-last_day).days
					if diff_days>365:
						y_count=0
						m_count=0
						w_count=0
					elif diff_days>30:
						m_count=0
						w_count=0
					elif diff_days>7:
						w_count=0
					else:
						pass
			total_count=getTotalCount(today)

			if addremove_flag==2:
				flag=False
				
				hb=Habit.objects.get(name=habit_name)
				date_string=""
				for hrs in hb.habitrecords_set.all():
					v=getValue(getHabitsDict(hrs.habits_string),hb.id)
					date_string=date_string+formatDate(hrs.date)+":"+str(v)+" "
				for hb in habits:
					if hb.id==habit_id:
						flag=True
				if False==flag:
					habits.append(HabitStructure(habit_id,habit_name,0,date_string))
				
				if False==habit_isnew:
					excepts=3
					habit_isnew=True
			
			elif addremove_flag==3:
				try:
					habit_id=Habit.objects.get(name=habit_name).id
					habits_temp=[]
					for hb in habits:
						if hb.id!=habit_id:
							habits_temp.append(hb)
					habits=habits_temp
				except Exception,e:
					print e
					excepts=4

			recorded_dates=getRecordedDates(habits)
			return render_to_response('habit.html',{'request_get_from':addremove_flag,'date':today,'weekday':weekday,'total_days':total_days,\
				'habits':habits,'y_count':y_count,'m_count':m_count,'w_count':w_count,'total_count':total_count,'excepts':excepts,'recorded_dates':recorded_dates})
	return  render_to_response('habit.html')


def getHabitsDict(habits_string):
	dic={}
	hss=habits_string.split(" ")
	for hs in hss:
		hs=hs.split(":")
		if len(hs)<2:
			continue
		dic.update({hs[0]:hs[1]})
	return dic

def getValue(hbdic,id):
	value=0
	if hbdic.has_key(id):
		value=hbdic[id]
	return value

def getHistoryHabitRecord(dt):
	date="";
	weekday="";
	total_days=0;
	habits=[]
	habits_string=""
	y_count=0;
	m_count=0;
	w_count=0;
	excepts=0;
	try:
		dy=HabitRecords.objects.get(date=dt)
		date=dy.date
		weekday=dy.weekday
		total_days=dy.total_days

		habits_string=dy.habits_string
		hbdic=getHabitsDict(habits_string)

		for hb in dy.habits.all():
			date_string=""
			for hrs in hb.habitrecords_set.all():
				v=getValue(getHabitsDict(hrs.habits_string),hb.id)
				date_string=date_string+formatDate(hrs.date)+":"+str(v)+" "
			value=getValue(hbdic,hb.id)
			habits.append(HabitStructure(hb.id,hb.name,value,date_string))

		y_count=dy.y_count
		m_count=dy.m_count
		w_count=dy.w_count
	except Exception,e:
		print e
		excepts=1
	return (date,weekday,total_days,habits,y_count,m_count,w_count,excepts)


def getLastDirayRecord():
	date="";
	total_days=0;
	habits=[]
	habits_string=""
	y_count=0;
	m_count=0;
	w_count=0;
	excepts=0
	try:
		dy=HabitRecords.objects.order_by("-date")[0]
		date=dy.date
		total_days=dy.total_days

		habits_string=dy.habits_string

		hbdic=getHabitsDict(habits_string)

		for hb in dy.habits.all():
			date_string=""
			for hrs in hb.habitrecords_set.all():
				v=getValue(getHabitsDict(hrs.habits_string),hb.id)
				date_string=date_string+formatDate(hrs.date)+":"+str(v)+" "
			value=getValue(hbdic,hb.id)
			habits.append(HabitStructure(hb.id,hb.name,value,date_string))

		y_count=dy.y_count
		m_count=dy.m_count
		w_count=dy.w_count
	except Exception,e:
		excepts=1
	return (date,total_days,habits,y_count,m_count,w_count,excepts)


def getTotalCount(ld):
	try:
		dy=HabitRecords.objects.order_by("date")[0]
		dt=dy.date.encode('UTF-8')
		first_day=datetime.date(int(dt[0:4]),int(dt[7:9]),int(dt[12:14]))
		ld=ld.encode('UTF-8')
		last_day=datetime.date(int(ld[0:4]),int(ld[7:9]),int(ld[12:14]))
		total_count=(last_day-first_day).days
		return total_count+1
	except Exception,e:
		print e
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

def getRecordedDates(habits):
	dic={}
	recorded_dates=""
	for hb in habits:
		hbl=hb.recorded_dates.split(" ")
		for hbs in hbl:
			hbs=hbs.split(":")
			if len(hbs)<2:
				continue
			if dic.has_key(hbs[0]):
				dic[hbs[0]]+=int(hbs[1])
			else:
				dic[hbs[0]]=int(hbs[1])
	for d in dic.keys():
		recorded_dates=recorded_dates+d+":"+str(dic[d])+" "
	return recorded_dates


