const RequestHelper = {
    getAuthHeader: () => {
        let token = window.localStorage.getItem("access_token");
        if (token != null && token.length > 0) {
            return {headers: {Authorization: `Token ${token}`}};
        }
        return {};
    },
    deleteToken: () => {
        window.localStorage.removeItem("access_token");
    }
};

export default RequestHelper;