import React, { useEffect } from 'react';

import { accountService } from '../../services';

function Login({ history }) {
    useEffect(() => {
        // redirect to home if already logged in
        if (accountService.accountValue) {
            history.push('/');
        }
        console.log('accountService.accountValue',accountService.accountValue)        
    }, [history]);

    return (
        <div className="col-md-6 offset-md-3 mt-5 text-center">
            <div className="card">
                <h4 className="card-header">React - Facebook Login Example</h4>
                <div className="card-body">
                    <button className="btn btn-facebook" onClick={accountService.login}>
                        <i className="fa fa-facebook mr-1"></i>
                        Login with Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}

export { Login };