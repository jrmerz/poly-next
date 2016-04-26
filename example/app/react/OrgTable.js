import React from 'react';

class OrgTable extends React.Component {
    
    constructor() {
        super();
        this.styles = {
            backgroundColor: '#000'
        };
        this.state = {
            orgs : []
        };
    }

    render() {
        var orgs = this.state.orgs;

        return (
            <table className="table">
                <tbody>
                    {orgs.map(function(org){
                        return <tr>
                            <td>{org.login}</td>
                            <td>{org.url}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        );
    }
}

export default OrgTable;