# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Habit',
            fields=[
                ('id', models.CharField(max_length=30, serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='HabitRecords',
            fields=[
                ('date', models.CharField(max_length=30, serialize=False, primary_key=True)),
                ('weekday', models.CharField(max_length=20)),
                ('total_days', models.CharField(max_length=20)),
                ('y_count', models.CharField(max_length=30)),
                ('m_count', models.CharField(max_length=20)),
                ('w_count', models.CharField(max_length=20)),
                ('habits', models.ManyToManyField(to='habit.Habit')),
            ],
        ),
    ]
