from django.contrib import admin

from api.feed.models import Post


class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'content')


admin.site.register(Post, PostAdmin)
