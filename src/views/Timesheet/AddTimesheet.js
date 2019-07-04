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
import Select from 'react-select';
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';

// Not enough time to improve the code, modularize it etc. There is a lot of scope for improvement.
class AddTimesheet extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
						id: null, submittedBy:null, creationDate:null, totalHours:0, sheetStatus:"Draft",
						computedTimePeriods: [], selectedTimePeriod: {}, tempDate: null, 
						tableColumnHeaders:[{text:"", date:"", dateDisplay:""}],
						rows: [{project:"", task:"", comment:"", hours:Array(15).fill(0), total:""}],
						active:true, memberId:"Admin"
					 };
					 
					 /*
						computedTimePeriods - Used for listing the 2 week time periods in a year (shown in the dropdown)
						selectedTimePeriod - Holds the time period selected by the user from the dropdown
						tableColumnHeaders - Has list of date for the selected time period and text for displaying table column headers
						row - Holds hours, projectId, taskId, comments etc. entered by the user.
					 */
	}

	componentDidMount() {
			let currentDate = new Date();
			let currentYear = currentDate.getFullYear();
			let startDate = new Date();			
			let DAYS_INTERVAL = 14;
			let NEXT_DAY_INTERVAL = 1;
			let computedTimePeriods = [];
			let timesheets = [];
			
			// set startDate to beginging of the year, ex: 2019 Jan 01
			// Ex: https://jsfiddle.net/taditdash/8FHwL/
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
			startDate.setYear(currentYear);
			startDate.setMonth(0,1);
			let nextDate = new Date(startDate);			
			
			while (nextDate.getFullYear() <= currentYear) {
				nextDate.setDate( nextDate.getDate() + DAYS_INTERVAL );
				const startMonth = startDate.toLocaleString('en-us', { month: 'long' });
				const endMonth = nextDate.toLocaleString('en-us', { month: 'long' });
				
				computedTimePeriods.push ({
					"startDate": startDate,
					"endDate": nextDate,
					"value": startDate,
					"label": this.getDateText(startDate) + " - " + this.getDateText(nextDate)
				});
				
				startDate = new Date(nextDate);
				startDate.setDate( startDate.getDate() + NEXT_DAY_INTERVAL );
				nextDate = new Date(startDate);			
			}
			
			this.setState({ computedTimePeriods: computedTimePeriods });
	}
	
	getDateText(date) {
		const startMonth = date.toLocaleString('en-us', { month: 'long' });
		return startMonth + " " + date.getDate() + " " + date.getFullYear();
	}
	
	handleSave(input) {
		let output = this.state;
		
		output.startDate = output.selectedTimePeriod.startDate;
		output.endDate = output.selectedTimePeriod.endDate;
		output.selectedPeriodDisplayText = output.selectedTimePeriod.label;
		output.userEfforts = output.rows;
		
		if(input === 2) {
			output.sheetStatus = "Approved";
		}		
		
		console.log(output);
		
		if(output.id) {
			axios.put('http://localhost:8090/timesheet/timesheets', output)
			.then(res => {
							console.log(res.data);
							if(input === 2)
								this.props.history.push('timesheets');
						}
				)
			.catch(error => {
				// TODO Handle API errors
				console.log('ERROR', error)
			})
		} else {
			axios.post('http://localhost:8090/timesheet/timesheets', output)
			.then(res => {
						console.log(res.data);
						this.setState({id: res.data.id});
						if(input === 2)
							this.props.history.push('timesheets');
					}
						)
			.catch(error => {
				// TODO Handle API errors
				console.log('ERROR', error)
			})
		}	
	}
	
	handleCancel() {
		this.props.history.push('timesheets');
	}
	
	handleTimePeriodSelection = (selectedTimePeriod) => {
		console.log('Option selected:', selectedTimePeriod);
		this.setState({ selectedTimePeriod });
		this.setState({tempDate: selectedTimePeriod.startDate});
		
		//Compute Table Headers
		let tableColumnHeaders = [];
		let startDate = selectedTimePeriod.startDate;
		let rowDates = [];
		
		for(let i=0; i<15; i++) {
			let tableColumnHeader = {text:"", date:"", dateDisplay:""};
			let tempDate = new Date(startDate);
			tempDate.setDate(startDate.getDate() + i);
			
			tableColumnHeader.date = tempDate;
			tableColumnHeader.text = tempDate.toLocaleString('en-us', { weekday: 'short' });
			tableColumnHeader.dateDisplay = (tempDate.getMonth() + 1) + "/" + tempDate.getDate();
			tableColumnHeaders.push(tableColumnHeader);
		}
		this.setState({tableColumnHeaders});
	}
	
	addRow = (e) => {
		this.setState((prevState) => ({
		rows: [...prevState.rows, {project:"", task:"", comment:"", hours:Array(15).fill(0), total:""}],
		}));
	}
	
	handleSubmit = (e) => { 
		e.preventDefault();
		console.log(this.state);
	}
  
  handleRowInputChange = (e) => {
	  console.log("Inside handleRowInputChange");
	  let rows = [...this.state.rows];
	  rows[e.target.dataset.id][e.target.className] = e.target.value;  
      this.setState({ rows }, () => console.log(this.state.rows));
  }
  
  handleHourChange = (e) => {
	  console.log("Inside handleHourChange");
	  
	  let rows = [...this.state.rows]
	  rows[e.target.dataset.id]["hours"][e.target.className] = e.target.value
	  
	  // Compute row total.
	  let val;
	  let rowTotal = 0;
	  
	  // TODO Show error message if user enters an invalid number
	  rowTotal = rows[e.target.dataset.id]["hours"]
					.filter((val)=> val && !isNaN(val))
					.reduce((acc, hour) => acc + parseFloat(hour),0);
	  rows[e.target.dataset.id].total = rowTotal;
	  
	  // Compute full table total.
	  const fullTableTotal = rows.reduce((acc, row) => acc + row.total, 0);
	  
      this.setState({ rows }, () => console.log(this.state.rows));
	  this.setState({totalHours: fullTableTotal});
  }
 
	render() {
		
		const { selectedTimePeriod, tableColumnHeaders, rows } = this.state;
		let tempDate = new Date(this.state.tempDate);


		return (
			 <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Create timesheet" subtitle="Timesheet" className="text-sm-left" />
    </Row>

    {/* Default Light Table */}
    <Row>
      <Col>
	  <Form onSubmit={this.handleSubmit}  >
	  
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Add your hours</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
			<br/>
            <Row form>
				<Col md="4" className="form-group">
					<Select className="form-control timePeriodSelect" classNamePrefix="form-control" placeholder="Select time period" 
						options={this.state.computedTimePeriods} value={selectedTimePeriod} onChange={this.handleTimePeriodSelection} />
				</Col>
			</Row>
                  
				  {
							selectedTimePeriod && selectedTimePeriod.startDate
								? (
								<Row form>
									<Col md="12" className="form-group">
								<Button onClick={() => this.addRow()}>+</Button>
								<br/>
								<table className="table mb-0" id="timesheetTable">
								<thead className="bg-light">
									 <tr>
                  <th scope="col" className="border-0">
                    Project
                  </th>
                  <th scope="col" className="border-0">
                    Task
                  </th>
                  <th scope="col" className="border-0">
                    Comments
                  </th>
				  {
					tableColumnHeaders.map((val, idx)=> {
						return (
							<th scope="col" className="border-0" key={idx}>
								{val.dateDisplay}<br/>{val.text}
							</th>
						)
					})
					}  
				  <th scope="col" className="border-0">
                    Total
                  </th>
                </tr>
				</thead>
              <tbody>
				{
          rows.map((val, idx)=> {
            let projId = `proj-${idx}`, taskId = `task-${idx}`, commentId=`comment-${idx}`, hourId=`hour-${idx}`
            return (
              <tr key={idx}>
			     <td>
					 <select name={projId} data-id={idx} id={projId} value={rows[idx].project} className="project"
							onChange={this.handleRowInputChange}>
						<option>Select Project</option>
						<option>ERES</option>
						<option>CAPEX</option>
					</select>
				  </td>
				  <td>
					<select name={taskId} data-id={idx} id={taskId} value={rows[idx].task} className="task"
							onChange={this.handleRowInputChange}>
						<option>Select Task</option>
						<option>Advice on Privacy Matters</option>
						<option>Legal Support Services</option>
						<option>Other (please describe)</option>
					</select>
				  </td>
				  <td>
					<textarea name={commentId} data-id={idx} id={commentId} value={rows[idx].comment} className="comment" 
						onChange={this.handleRowInputChange} />
				  </td>
				  
				{
					val.hours.map((hourItem, hourIndex)=> {						
						return (
							<td key={hourIndex}>
								<input name={hourId+hourIndex} data-id={idx} id={hourId+hourIndex} value={rows[idx][hourIndex]} 
									className={hourIndex}
									onChange={this.handleHourChange} style={{width: "3em"}}/>
							</td>		
						)
					})
				}
				<td>
					{rows[idx].total}
				</td>
              </tr>
            )
          })
        }
              </tbody>
            </table>
				<b>Total Hours: {this.state.totalHours}</b>
			</Col>
			</Row>
								) : null
				  }
			
			
			
			<Row form>
				<Col md="4" className="form-group">
					<Button onClick={() => this.handleSave(1)}>Save Draft</Button>
				</Col>
				<Col md="4" className="form-group">
					<Button onClick={() => this.handleSave(2)}>Submit</Button>
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

export default withRouter(AddTimesheet);
