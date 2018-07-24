from django.test import TestCase, RequestFactory
from friendship.models import Follow

from api.accounts.models import TwitterishUser
from api.feed.views import MainFeedList, UserFeedList, PostDetail, CreatePost
from api.utils import build_test_user, build_test_post


class MainFeedListTest(TestCase):

    def test_main_feed_list_with_user(self):
        user, token = build_test_user()
        user_2 = TwitterishUser.objects.create_user("name1", "email1", "password1")
        user_3 = TwitterishUser.objects.create_user("name2", "email2", "password2")

        post_1 = build_test_post(user, "post 1")
        post_2 = build_test_post(user_2, "post 2")
        post_3 = build_test_post(user_3, "post 3")

        Follow.objects.add_follower(user, user_2)
        Follow.objects.add_follower(user, user_3)

        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"

        main_feed_list = MainFeedList()
        main_feed_list.request = request
        main_feed_list.format_kwarg = None
        response = main_feed_list.get(request)

        assert response.status_code == 200
        assert len(response.data) == 3
        assert response.data[0].get('content') == post_3.content
        assert response.data[1].get('content') == post_2.content
        assert response.data[2].get('content') == post_1.content

    def test_main_feed_list_with_no_user(self):
        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = None

        main_feed_list = MainFeedList()
        assert main_feed_list.get(request).status_code == 403


class UserFeedListTest(TestCase):

    def test_public_user_feed(self):
        user, token = build_test_user()
        post = build_test_post(user, "post 1")

        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = None

        user_feed_list = UserFeedList()
        user_feed_list.request = request
        user_feed_list.format_kwarg = None

        response = user_feed_list.get(request, username=user.username)

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0].get('content') == post.content

    def test_private_user_feed_no_follow(self):
        build_test_user()
        user_2 = TwitterishUser.objects.create_user("name1", "email1",
                                                    "password1")
        user_2.private = True
        user_2.save()

        build_test_post(user_2, "post 1")

        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"

        user_feed_list = UserFeedList()
        user_feed_list.request = request
        user_feed_list.format_kwarg = None

        response = user_feed_list.get(request, username=user_2.username)

        assert response.status_code == 403

    def test_private_user_feed_follow(self):
        user, token = build_test_user()
        user_2 = TwitterishUser.objects.create_user("name1", "email1",
                                                    "password1")
        user_2.private = True
        user_2.save()

        Follow.objects.add_follower(user, user_2)

        post = build_test_post(user_2, "post 1")

        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"

        user_feed_list = UserFeedList()
        user_feed_list.request = request
        user_feed_list.format_kwarg = None

        response = user_feed_list.get(request, username=user_2.username)

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0].get('content') == post.content


class PostDetailTest(TestCase):

    def test_post_detail(self):
        user, token = build_test_user()
        post = build_test_post(user, "post 1")

        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = None

        post_deatil = PostDetail()
        post_deatil.request = request
        post_deatil.format_kwarg = None

        response = post_deatil.get(request, post_id=post.pk)

        assert response.status_code == 200
        assert response.data.get('content') == post.content

    def test_post_detail_private(self):
        build_test_user()

        user_2 = TwitterishUser.objects.create_user("name1", "email1",
                                                    "password1")
        user_2.private = True
        user_2.save()

        post = build_test_post(user_2, "post 1")

        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = None

        post_deatil = PostDetail()
        post_deatil.request = request
        post_deatil.format_kwarg = None

        response = post_deatil.get(request, post_id=post.pk)

        assert response.status_code == 403

    def test_post_detail_private_follow(self):
        user, token = build_test_user()

        user_2 = TwitterishUser.objects.create_user("name1", "email1",
                                                    "password1")
        user_2.private = True
        user_2.save()

        Follow.objects.add_follower(user, user_2)

        post = build_test_post(user_2, "post 1")

        request = RequestFactory().get("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"

        post_deatil = PostDetail()
        post_deatil.request = request
        post_deatil.format_kwarg = None

        response = post_deatil.get(request, post_id=post.pk)

        assert response.status_code == 200
        assert response.data.get('content') == post.content


class CreatePostTest(TestCase):

    def test_create_post(self):
        build_test_user()

        request = RequestFactory().post("/")
        request.META['HTTP_AUTHORIZATION'] = "Token 123456789"
        request.data = {'content': "post content"}

        create_post = CreatePost()
        create_post.request = request
        create_post.format_kwarg = None

        response = create_post.post(request)
        assert response.status_code == 200
        assert response.data.get('content') == "post content"

    def test_create_post_no_user(self):
        request = RequestFactory().post("/")
        request.META['HTTP_AUTHORIZATION'] = None
        request.data = {'content': "post content"}

        create_post = CreatePost()
        create_post.request = request
        create_post.format_kwarg = None

        response = create_post.post(request)
        assert response.status_code == 403