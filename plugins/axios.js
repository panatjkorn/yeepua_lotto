export default function({ app, $axios, redirect }) {
    $axios.onError(error => {
        if (
            (error.response && error.response.status === 401) ||
            error.response.status === 423
        ) {
            app.$auth.reset();
            redirect('/login');
        }
    });
}
