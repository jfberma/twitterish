"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from api.accounts.views import UserList, FollowingList, FollowUser, \
    FeedPrivacySetting, UnFollowUser
from api.feed.views import MainFeedList, UserFeedList, PostDetail, CreatePost

API_PREFIX = "api/v1/"


def build_api_url(path):
    return r'^' + API_PREFIX + path


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # api
    url(build_api_url('users/$'), UserList.as_view()),
    url(build_api_url('users/following/$'), FollowingList.as_view()),
    url(build_api_url('users/follow/$'), FollowUser.as_view()),
    url(build_api_url('users/unfollow/$'), UnFollowUser.as_view()),
    url(build_api_url('privacy/$'), FeedPrivacySetting.as_view()),
    url(build_api_url('auth/'), include('djoser.urls')),
    url(build_api_url('auth/'), include('djoser.urls.authtoken')),

    url(build_api_url('feed/$'), MainFeedList.as_view()),
    url(build_api_url('feed/(?P<username>[^/]+)/$'), UserFeedList.as_view()),
    url(build_api_url('post/(?P<post_id>[^/]+)/$'), PostDetail.as_view()),
    url(build_api_url('post/$'), CreatePost.as_view())
]
