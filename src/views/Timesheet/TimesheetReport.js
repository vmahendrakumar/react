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
						startDate: "", endDate: null, sheetStatus: null
					 };
	}

	componentDidMount() {
			
			/*
			axios.get('http://localhost:8090/timesheet/timesheets/32bc036a-4e4e-4094-bb2b-5736e80315b6')
			.then(res => {
							console.log(res.data);
						}
				)
			.catch(error => {
				// TODO Handle API errors
				console.log('ERROR', error)
			});
			*/
	}
	
	handleCancel() {
		this.props.history.push('timesheets');
	}
	
	handleSearch() {
		let output = this.state;
		
		output.startDate = output.selectedTimePeriod.startDate;
		output.endDate = output.selectedTimePeriod.endDate;
		output.userEfforts = output.rows;
		
		console.log(output);
		
		if(output.id) {
			axios.put('http://localhost:8090/timesheet/timesheets', output)
			.then(res => {
							console.log(res.data);
							//if(input === 2)
								this.props.history.push('timesheets');
						}
				)
			.catch(error => {
				// TODO Handle API errors
				console.log('ERROR', error)
			})
		}		
	}
  
  handleInputChange = (e) => {}
 
	render() {
	const { startDate, endDate, sheetStatus } = this.state;
		//let tempDate = new Date(this.state.tempDate);


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
				<Col md="2" className="form-group">
					Start Date:
				</Col>
				<Col md="2" className="form-group">
					<input type="date" value={startDate} onChange={this.handleInputChange} />
				</Col>
			</Row>
			<Row form>
				<Col md="2" className="form-group">
					End Date:
				</Col>
				<Col md="2" className="form-group">
					<input type="date" value={endDate} onChange={this.handleInputChange} />
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
