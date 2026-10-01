from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("api/compress/", views.compress_pdf, name="compress_pdf"),
]
