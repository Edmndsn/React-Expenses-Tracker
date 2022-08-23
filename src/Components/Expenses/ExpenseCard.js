import React, { useState, useEffect } from "react";
import "./ExpenseCard.css";
import addImage from "../../images/add-image.svg";
import CategoryImage from "./CategoryImage";
import { useNavigate } from "react-router-dom";
import "./CreateExpense.css";
import { nanoid } from "nanoid";
import { db } from "../../firebase-config";
import {
	addDoc,
	doc,
	collection,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";

function ExpenseCard(props) {
	const currentDate = new Date().toISOString().substring(0, 10);

	// data.title works
	const [data, setData] = useState({
		title: props.title || "",
		company: props.company || "",
		currency: props.currency || "",
		amount: props.amount || "",
		category: props.category || "",
		date: props.date || currentDate,
		invoice: props.invoice,
		createdAt: serverTimestamp(),
		recurring: props.recurring || "false",
	});

	const [addExpenseError, setAddExpenseError] = useState({
		title: false,
		amount: false,
	});

	const navigate = useNavigate();
	const expenseRef = collection(db, "expense");

	function handleChange(event) {
		const { name, value, checked, type } = event.target;
		setData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	}

	useEffect(() => {}, [data]);

	// Allows lower case, uppercase, numbers and underscores
	function titleChecker() {
		if (data.title !== "")
			setAddExpenseError((prevError) => ({
				...prevError,
				title: !/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]$/i.test(data.title),
			}));
	}

	// Checks the amount is a valid input (requires numbers, thousands separators, two digit fraction, cents/pence optional)
	function amountChecker() {
		if (data.amount !== "")
			setAddExpenseError((prevError) => ({
				...prevError,
				amount:
					!/^[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/.test(
						data.amount
					),
			}));
	}

	useEffect(() => {
		titleChecker();
		amountChecker();
	}, [data]);

	function handleSubmit(event) {
		event.preventDefault();
		if (!addExpenseError.title && !addExpenseError.amount) {
			props.handleClick(data);
		}
	}

	return (
		<div key={props.invoice}>
			<form
				className={
					!props.editExpense ? "expense-card-container" : "edit-selected"
				}
				onSubmit={(event) => props.handleClick(event)}
			>
				<div className="card-element name-business-container">
					<input
						className={
							!props.editExpense
								? "expense-card-text"
								: "expense-card-text edit"
						}
						disabled={!props.editExpense}
						name="title"
						value={data.title}
						onChange={handleChange}
					></input>
					<input
						className={
							!props.editExpense
								? "expense-card-subtext"
								: "expense-card-subtext edit"
						}
						disabled={!props.editExpense}
						name="company"
						value={data.company}
						onChange={handleChange}
					></input>
				</div>
				<div className="card-element type">
					<div className="type-image-container">
						<CategoryImage key={props.id} expenseCategory={data.category} />
					</div>

					{!props.editExpense ? (
						<p>{data.category}</p>
					) : (
						<select
							className={
								!props.editExpense
									? "expense-card-text type"
									: "expense-card-text edit type"
							}
							disabled={!props.editExpense}
							name="category"
							defaultValue={data.category}
							onChange={handleChange}
						>
							<option defaultValue="" hidden>
								Category
							</option>
							<option>Entertainment</option>
							<option>Food</option>
							<option>General</option>
							<option>Healthcare</option>
							<option>Household</option>
							<option>Housing</option>
							<option>Insurance</option>
							<option>Investing</option>
							<option>Mobile</option>
							<option>Payment</option>
							<option>Personal</option>
							<option>Savings</option>
							<option>Subscriptions</option>
							<option>Transport</option>
							<option>Withdraw</option>
						</select>
					)}
				</div>
				<div className="card-element">
					{!props.editExpense ? (
						<p>{data.currency}</p>
					) : (
						<select
							className="select-currency"
							name="currency"
							value={data.currency}
							onChange={handleChange}
						>
							<option>£</option>
							<option>$</option>
							<option>€</option>
						</select>
					)}
					<input
						className={
							!props.editExpense
								? "expense-card-text amount"
								: "expense-card-text edit amount"
						}
						disabled={!props.editExpense}
						name="amount"
						value={data.amount}
						onChange={handleChange}
					></input>
				</div>
				<div className="card-element date-container">
					<input
						className={
							!props.editExpense
								? "expense-card-text"
								: "expense-card-text edit"
						}
						disabled={!props.editExpense}
						value={data.date}
						onChange={handleChange}
					></input>
				</div>
				<div className="card-element">
					<input
						className={"expense-card-text invoice"}
						disabled
						value={data.invoice}
					></input>
				</div>
				<div className="card-element button-container">
					{/* Edit = false, display edit button */}
					{!props.editExpense && (
						<button
							type="button"
							className="action-button"
							onClick={(event) => props.edit(event, data.invoice)}
						>
							Edit
						</button>
					)}

					{props.editExpense && (
						<button className="action-button" onClick={handleSubmit}>
							Submit
						</button>
					)}
					{props.editExpense && (
						<button
							className="action-button"
							value="Delete"
							onClick={(e) => {
								e.preventDefault();
								props.handleDelete();
							}}
						>
							Delete
						</button>
					)}
				</div>
			</form>
		</div>
	);
}

export default ExpenseCard;
