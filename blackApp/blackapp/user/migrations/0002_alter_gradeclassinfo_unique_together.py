# Generated by Django 4.0.4 on 2022-04-26 09:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='gradeclassinfo',
            unique_together={('gradeName', 'className')},
        ),
    ]