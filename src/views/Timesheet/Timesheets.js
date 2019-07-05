import React, { Component } from 'react';

import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../../components/common/PageTitle"

import { Link, withRouter } from 'react-router-dom';
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';

class Timesheets extends Component {

	constructor(props) {
		super(props);
		this.state = { timesheets: [] };
	}

	componentDidMount() {
		
		axios.get('http://localhost:8090/timesheet/timesheets')
			.then(res => {
							console.log(res);
							//console.log(JSON.stringify(res));
							this.setState({timesheets: res.data.timesheets});
						 }
				)
			.catch(error => {
				// TODO Handle API errors
				console.log('ERROR', error)
			})
	}

	handleCreate() {
		this.props.history.push('addtimesheet');
	}

	render() {
		const { timesheets } = this.state;
		
		console.log(timesheets);

		return (
				<Container fluid className="main-content-container px-4">
					{/* Page Header */}
					<Row noGutters className="page-header py-4">
						<PageTitle sm="4" title="Timesheets" subtitle="Timesheets" className="text-sm-left" />
					</Row>

					{/* Default Light Table */}
					<Row>
						<Col>
							<Card small className="mb-4">
								<CardHeader className="border-bottom">
									<h6 className="m-0">Your Timesheets</h6>
								</CardHeader>
								<CardBody className="p-0 pb-3">
									<br/>
									<Button color="success" className="px-4" onClick={() => { this.handleCreate() }}>Create</Button>							
									<br/>
									
									<ReactTable data={timesheets}
										columns={[
            {
              Header: "Period",
			  accessor: "selectedPeriodDisplayText",
			  //id: "lastName"
			  Cell: e => (
					<Link to={{ 
								pathname: "edittimesheet", 
								rowData: {timesheet: timesheets[e.index]} 
							 }}>{e.value}</Link>
			  )
            },
            {
              Header: "Hours",
			  accessor: "totalHours"
            },
            {
              Header: 'Status',
			  accessor: "sheetStatus"
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
									
		
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
		)
	}

}


export default withRouter(Timesheets);