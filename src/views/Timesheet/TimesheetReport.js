import React, { Component } from 'react';

import { Container, Row, Col, Card, CardHeader, CardBody, Button, 
  Form,
  FormInput,
  FormSelect,
  FormGroup,
  FormTextarea,
  DatePicker  } from "shards-react";

import PageTitle from "../../components/common/PageTitle";

import { withRouter } from 'react-router-dom';
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';

// Not enough time to improve the code, modularize it etc. There is a lot of scope for improvement.
class TimesheetReport extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
						startDate: "", endDate: "", sheetStatus: "", results:[]
					 };
	}

	componentDidMount() {
		
	}
	
	handleCancel() {
		this.props.history.push('timesheets');
	}
	
	handleSearch() {
		let input = this.state;
		
		//input.startDate = input.selectedTimePeriod.startDate;
		//input.endDate = input.selectedTimePeriod.endDate;
		//input.userEfforts = input.rows;
		
		console.log(input);
		
		if(input) {
			//axios.get('http://localhost:8090/timesheet/reports', {data: input})
			axios.post('http://localhost:8090/timesheet/reports', input)
			.then(res => {
							console.log(res.data);
							this.setState({results: res.data.timesheetReports});
						}
				)
			.catch(error => {
				// TODO Handle API errors
				console.log('ERROR', error)
			})
		}
		
	}
  
  handleStartDateChange = (e) => {		
	  this.setState({startDate: e.target.value});
  }
  
  handleEndDateChange = (e) => {		
	  this.setState({endDate: e.target.value});
  }
 
	render() {
	const { startDate, endDate, sheetStatus, results } = this.state;


		return (
			 <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Timesheet Reports" subtitle="Timesheet" className="text-sm-left" />
    </Row>

    {/* Default Light Table */}
    <Row>
      <Col>
	  <Form onSubmit={this.handleSubmit}  >
	  
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Search</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
			<br/>
            <Row form>
				<Col md="3" className="form-group">
					Start Date* (yyyy-mm-dd):
				</Col>
				<Col md="2" className="form-group">
					<input type="text" value={startDate} onChange={this.handleStartDateChange} />
				</Col>
			</Row>
			<Row form>
				<Col md="3" className="form-group">
					End Date* (yyyy-mm-dd):
				</Col>
				<Col md="2" className="form-group">
					<input type="text" value={endDate} onChange={this.handleEndDateChange} />
				</Col>
			</Row>
			<Row form>
				<Col>
				<br/>
					<ReactTable data={results}
										columns={[
            {
              Header: "User",
			  accessor: "memberId",
			  //id: "lastName"
            },
			{
              Header: "Project",
			  accessor: "project"
            },
            {
              Header: "Task",
			  accessor: "task"
            },
            {
              Header: 'Comment',
			  accessor: "comment"
            },
			{
              Header: 'Date',
			  accessor: "entryDate"
            },
			{
              Header: 'Hours',
			  accessor: "hours"
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
		<br/>
				</Col>
			</Row>
			<Row form>
			<Col md="4" className="form-group">
					<Button onClick={() => this.handleSearch()}>Search</Button>
				</Col>
				<Col md="4" className="form-group">
					<Button onClick={() => this.handleCancel()}>Cancel</Button>
				</Col>	
			</Row>
		  </CardBody>
        </Card>
		
		
		</Form>
      </Col>
    </Row>
  </Container>
		);
	}
}

export default withRouter(TimesheetReport);
