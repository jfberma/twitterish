from django.test import TestCase, RequestFactory
from rest_framework.authtoken.models import Token

from api.accounts.models import TwitterishUser
from api.accounts.serializers import UserSerializer
from api.accounts.views import FollowingList, FollowUser, UnFollowUser, \
    FeedPrivacySetting
from api.utils import build_test_user


class FollowingListTest(TestCase):

    def test_follow_list_with_user(self):
        build_test_user()
        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"

        following_list = FollowingList()
        following_list.serializer_class = UserSerializer
        following_list.request = request
        following_list.format_kwarg = None
        assert following_list.get(request).status_code == 200

    def test_follow_list_with_no_user(self):
        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = None

        following_list = FollowingList()
        assert following_list.get(request).status_code == 403


class FollowUserTest(TestCase):

    def test_follow_user_with_user(self):
        build_test_user()
        user_to_follow = TwitterishUser.objects.create_user("name1", "email1",
                                                            "password1")

        request = RequestFactory().post("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"
        request.data = {'user': user_to_follow.pk}

        follow_user = FollowUser()
        follow_user.request = request
        follow_user.format_kwarg = None
        response = follow_user.post(request)
        assert response.status_code == 200
        assert response.data is not None

    def test_follow_user_without_user(self):
        request = RequestFactory().post("/")
        request.META['HTTP_AUTHORIZATION'] = None

        follow_user = FollowUser()
        assert follow_user.post(request).status_code == 403


class UnFollowUserTest(TestCase):

    def test_unfollow_user_with_user(self):
        build_test_user()
        user_to_follow = TwitterishUser.objects.create_user("name1", "email1",
                                                            "password1")

        request = RequestFactory().post("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"
        request.data = {'user': user_to_follow.pk}

        follow_user = FollowUser()
        follow_user.request = request
        follow_user.format_kwarg = None
        response = follow_user.post(request)
        assert response.status_code == 200

        request = RequestFactory().post("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"
        request.data = {'user': user_to_follow.pk}

        unfollow_user = UnFollowUser()
        unfollow_user.request = request
        unfollow_user.format_kwarg = None
        response = unfollow_user.post(request)
        assert response.status_code == 200

    def test_unfollow_user_without_user(self):
        request = RequestFactory().post("/")
        request.META['HTTP_AUTHORIZATION'] = None

        unfollow_user = UnFollowUser()
        assert unfollow_user.post(request).status_code == 403


class FeedPrivacySettingsTest(TestCase):

    def test_feed_privacy_update(self):
        build_test_user()
        request = RequestFactory().put("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"
        request.data = {'private': True}

        feed_privacy_setting = FeedPrivacySetting()
        feed_privacy_setting.request = request
        feed_privacy_setting.format_kwarg = None
        response = feed_privacy_setting.put(request)

        assert response.status_code == 200
        assert response.data['private'] is True

    def test_feed_privacy_update_without_user(self):
        request = RequestFactory().put("/")
        request.META['HTTP_AUTHORIZATION'] = None

        feed_privacy_setting = FeedPrivacySetting()
        assert feed_privacy_setting.put(request).status_code == 403