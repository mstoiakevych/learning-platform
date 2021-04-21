from django.utils.crypto import get_random_string
from users.models import CustomUser
from django.db import models


def get_random_hash():
    return get_random_string(6)


class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    code = models.CharField(max_length=6,
                            blank=True,
                            editable=False,
                            unique=True,
                            default=get_random_hash)
    subject = models.CharField(max_length=100, null=True)
    section = models.CharField(max_length=100, null=True, blank=True)
    audience = models.CharField(max_length=100, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    students = models.ManyToManyField(CustomUser, blank=True, related_name='courses')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name


class CourseRequest(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    code = models.CharField(max_length=Course._meta.get_field('code').max_length)

    def __str__(self):
        return f'Request to {self.course} by {self.student}'


class Module(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.course}__{self.name}'


class Lesson(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.module}__{self.name}'


class TaskBase(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)


class Task(TaskBase):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    max_score = models.IntegerField()
    due_date = models.DateField()

    def __str__(self):
        return f'{self.lesson}__{self.name}'


class HomeTask(TaskBase):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='home_task_set')
    assignment = models.ForeignKey(Task, on_delete=models.CASCADE)
    mark = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f'{self.assignment}__{self.name}'


class ItemBase(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    task = models.ForeignKey(TaskBase, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Text(ItemBase):
    content = models.TextField()


class File(ItemBase):
    file_item = models.FileField(upload_to='files')


class Image(ItemBase):
    image_item = models.FileField(upload_to='images')


class Video(ItemBase):
    url = models.URLField()


class Mark(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    score = models.IntegerField(default=None, blank=True, null=True)
    max_score = models.IntegerField(blank=False)
