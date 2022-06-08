from django.http import HttpResponse, HttpResponseRedirect
from django.views import View
from django.shortcuts import redirect, render
from course.forms import CourseForm
from course.models import Course

# Create your views here.


# class Index(View):
#     def get(self, request):
#         # return HttpResponse("hello world")
#         return render(request, 'course/create.html')

# def index(request):
#     c = Course.objects.all()
#     return render(request, 'course/index.html', {'courses': c})

def index(request):
    courses = Course.objects.all()
    context = {
        'title': 'Courses',
        'page': 'table',
        'courses': courses,
        'range': range(60)
    }
    return render(request, 'course/courses.html', context)


def create(request):
    form = CourseForm()
    context = {
        'title': 'Courses',
        'form': form
    }

    if request.method == 'POST':
        form = CourseForm(request.POST)
        if form.is_valid():
            print("success")
            form.save()
        return redirect(index)
    return render(request, 'course/CourseForm.html', context)


def update(request, id):
    course = Course.objects.get(pk=id)
    form = CourseForm(instance=course)
    context = {
        'title': 'Courses',
        'form': form,
        'id': course.id
    }

    if request.method == 'POST':
        form = CourseForm(request.POST, instance=course)
        if form.is_valid():
            print("success")
            form.save()
            return redirect(update, id)
    return render(request, 'course/CourseForm.html', context)


def delete(request, id):
    course = Course.objects.get(pk=id)
    context = {
        'title': 'Courses',
        'id': course.id
    }
    if request.method == 'POST':
        course.delete()
        return redirect(index)
    return render(request, 'course/delete.html', context)
