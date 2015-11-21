# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('habit', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='habitrecords',
            name='habits_string',
            field=models.CharField(default=b'', max_length=200),
        ),
    ]
