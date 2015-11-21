from django.db import models

# Create your models here.

class Habit(models.Model):
	id=models.CharField(max_length=30,primary_key=True);
	name=models.CharField(max_length=100)
	def __unicode__(self):
		return u'%s %s' % (self.id, self.name)


class HabitRecords(models.Model):
	date=models.CharField(max_length=30,primary_key=True);
	weekday=models.CharField(max_length=20);
	total_days=models.CharField(max_length=20);
	habits=models.ManyToManyField(Habit);
	habits_string=models.CharField(max_length=200,default="")
	y_count=models.CharField(max_length=30);
	m_count=models.CharField(max_length=20);
	w_count=models.CharField(max_length=20);
	def __unicode__(self):
		return self.date
