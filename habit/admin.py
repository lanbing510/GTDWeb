from django.contrib import admin

# Register your models here.

from habit.models import Habit, HabitRecords


class HabitAdmin(admin.ModelAdmin):
	list_display=('id','name',)
	list_filter=('id',)
	ordering=('-id',)

class HabitRecordsAdmin(admin.ModelAdmin):
	list_display=('date','weekday','total_days',)
	list_filter=('date',)
	ordering=('-date',)


admin.site.register(Habit,HabitAdmin);
admin.site.register(HabitRecords,HabitRecordsAdmin)