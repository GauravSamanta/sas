# Generated by Django 4.0.5 on 2022-06-13 03:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=10)),
                ('scheme', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=50)),
                ('dept', models.CharField(choices=[('Computer Engineering', 'Computer Engineering'), ('Electronics and Telecommunication Engineering', 'Electronics and Telecommunication Engineering'), ('Information Technology', 'Information Technology'), ('Mechanical Engineering', 'Mechanical Engineering')], max_length=50, verbose_name='Department')),
                ('sem', models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5'), (6, '6'), (7, '7'), (8, '8')], verbose_name='Semester')),
                ('is_elective', models.BooleanField(default=False)),
                ('dept_level', models.BooleanField(default=True)),
                ('institue_level', models.BooleanField(default=False)),
            ],
        ),
    ]
