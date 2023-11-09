from django.db import models
from django.conf import settings


# Create your models here.
class Detection(models.Model):
    id = models.AutoField(
        primary_key=True
    )
    creation_date = models.DateTimeField(
        auto_now_add=True,
        null=False,
        blank=False
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    file_name = models.CharField(max_length=30)
    result = models.CharField(max_length=4)
    confidence = models.PositiveSmallIntegerField()

    def __str__(self):
        return self.file_name
