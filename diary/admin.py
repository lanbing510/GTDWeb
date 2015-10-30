from django.contrib import admin

# Register your models here.

from diary.models import Diary


class DiaryAdmin(admin.ModelAdmin):
	list_display=('date','weekday','total_days',)
	list_filter=('date',)
	ordering=('-date',)



admin.site.register(Diary,DiaryAdmin)
