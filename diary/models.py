from django.db import models

# Create your models here.
class  Diary(models.Model):
	date      =models.CharField(max_length=30,primary_key=True);
	weekday   =models.CharField(max_length=20);
	total_days=models.CharField(max_length=20);
	editor0=models.CharField(max_length=1000);
	editor1=models.CharField(max_length=1000);
	editor2=models.CharField(max_length=1000);
	editor3=models.CharField(max_length=1000);
	editor4=models.CharField(max_length=1000);
	editor5=models.CharField(max_length=1000);
	editor6=models.CharField(max_length=1000);
	editor7=models.CharField(max_length=1000);
	editor8=models.CharField(max_length=1000);
	y_count=models.CharField(max_length=30);
	m_count=models.CharField(max_length=20);
	w_count=models.CharField(max_length=20);
	def __unicode__(self):
		return self.date
