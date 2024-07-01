import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '../../services';
import Select from 'react-select';

import axios from 'axios';
const baseUrl = `${process.env.REACT_APP_API_URL}`;

function Home() {
    const [mounted, setMounted] = useState(false);
    const [accounts, setAccounts] = useState(null);
    const [options,setOptions] = useState(null)
    const [pageData,setPageData] = useState(null)
    useEffect( () => {
        setMounted(true);
        async function getPages() {
            let influencer_id = localStorage.getItem('influencer_id')
            if(influencer_id){
                let account = await axios.get(`${baseUrl}/api/facebook/page_list?influencer_id=${influencer_id}`);
                setAccounts(account.data.result);
                let pages = []
                account.data.result.facebook.forEach(element => {
                    pages.push({value:element.id+'-'+element.oauth_token,label:element.name})
                });
                setOptions(pages)
            }
        }
        getPages();
        
        return () => setMounted(false);
    }, []);
    console.log('accounts',accounts)
    function deleteAccount(id) {
        // set isDeleting flag to show spinner
        setAccounts(accounts.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));

        // delete account
        accountService.delete(id).then(() => {
            if (mounted) {
                setAccounts(accounts.filter(x => x.id !== id));
            }
        });
    }
    async function handleChange(options){
        if(options.length){
            let pageArr = options[0]['value'].split('-')
            let pageData = await axios.post(`${baseUrl}/api/facebook/page_data`,{page_id:pageArr[0],accessToken:pageArr[1]});
            console.log('pageData',pageData)
            setPageData(pageData?.data.result.data)
        }
    }
    return (
        <div>
            <h2>You're logged in with React & Facebook!!</h2>
            <p>All accounts from secure api end point:</p>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Facebook Id</th>
                        <th>Name</th>
                        <th>Picture</th>
                        <th>Pages</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{accounts?.influencer_id}</td>
                        <td>{accounts?.name}</td>
                        <td><img src={accounts?.profile_image_url}/></td>
                    <td>
                    <React.Fragment>
                        <Select
                        isMulti
                        onChange={handleChange}
                        options={options}
                        />
                    
                    </React.Fragment>
                    </td>
                    </tr>
                    <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Values</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData && pageData.map(account =>
                        <tr key={account.id}>
                            <td>{account.title}</td>
                            <td>
                            <tbody>
                    {account && account.values.map(val =>
                        <tr>
                            <td>{val.end_time}</td>
                            <td>----{val.value}
                            </td>
                        </tr>
                    )}
                    </tbody>
                            </td>
                        </tr>
                    )}
                    </tbody>
                    </table>
                </tbody>
            </table>
        </div>
    );
}

export { Home };