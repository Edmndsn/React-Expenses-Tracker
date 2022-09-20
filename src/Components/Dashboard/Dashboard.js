import React, { useEffect } from "react";
import "./dashboard.css";
import wallet from "../../images/wallet_icon.svg";
import greenWallet from "../../images/green_wallet_icon.svg";
import dailyWallet from "../../images/daily_wallet_icon.svg";
import expand from "../../images/expand_icon.svg";
import { useExpenses } from "../../Contexts/ExpensesContext";
import ExpenseCard from "../Expenses/ExpenseCard";
import Filters from "../Expenses/Filters";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Chart from "./Chart.js";
import { useAuth } from "../../Contexts/AuthContext";

export default function Dashboard(props) {
  const { expenses, weeklyExpenses, monthlyExpenses, totalExpenses, setSort } =
    useExpenses();
  const { userDetails } = useAuth();

  const totalSpending = totalExpenses.reduce(
    (total, item) => total + +item.amount,
    0
  );

  const monthlySpending = monthlyExpenses.reduce(
    (total, item) => total + +item.amount,
    0
  );

  const weeklySpending = weeklyExpenses.reduce(
    (total, item) => total + +item.amount,
    0
  );

  const recurringExpensesArr = expenses
    .filter(item => item.recurring === true)
    .map(expense => (
      <ExpenseCard
        key={expense.invoice}
        title={expense.title}
        company={expense.company}
        category={expense.category}
        currency={userDetails.currency}
        amount={expense.amount}
        class="expense-dashboard-recurring"
        recurringExpenses
      />
    ));

  const navigate = useNavigate();

  useEffect(() => {
    setSort(["date", "asc"]);
  }, [setSort]);

  const expensesArr = expenses
    .slice(0, 3)
    .map(expense => (
      <ExpenseCard
        key={expense.invoice}
        title={expense.title}
        company={expense.company}
        category={expense.category}
        currency={userDetails.currency}
        amount={expense.amount}
        date={expense.date}
        class="expense-dashboard"
      />
    ));

  const date = new Date().toISOString().substring(0, 10);

  return (
    <div
      className={
        props.toggleDarkMode
          ? "dashboard-container dark"
          : "dashboard-container"
      }
    >
      <Header toggleDarkMode={props.toggleDarkMode} />

      <div className="dash-container">
        <div className="resume-container">
          <section className="amounts-tab">
            <div className="amount-itm-total">
              <img src={greenWallet} alt="wallet-icon" />
              <div>
                <p className="amount-title">Total Spending</p>
                <h2 className="amount-value">{`${userDetails.currency}${totalSpending}`}</h2>
              </div>
            </div>

            <div className="amount-itm">
              <img src={wallet} alt="wallet-icon2" />
              <div>
                <p className="amount-title">Monthly Spending</p>
                <h2 className="amount-value">{`${userDetails.currency}${monthlySpending}`}</h2>
              </div>
            </div>

            <div className="amount-itm">
              <img src={dailyWallet} alt="wallet-icon3" />
              <div>
                <p className="amount-title">Weekly Spending</p>
                <h2 className="amount-value">{`${userDetails.currency}${weeklySpending}`}</h2>
              </div>
            </div>
          </section>

          <div className="graph-container">
            <h3 className="section-title">Outgoings</h3>
            <Chart />
          </div>

          <section className="dashboard-expense-container">
            <div className="dashboard-expense-title">
              <h3 className="section-title">Recent Expenses</h3>
              <button
                className="expand-btn"
                onClick={() => navigate("expenses")}
              >
                View All
                <img
                  src={expand}
                  className="expand-icon"
                  alt="view-all-button"
                />
              </button>
            </div>
            <div className="filters-container">
              <Filters toggleDarkMode={props.toggleDarkMode} />
            </div>
            <div className="dashboard-expense-card">{expensesArr}</div>
          </section>
        </div>

        <div className="recurring-expenses-container">
          <div className="title-recurring-expenses">
            <h3 className="section-title">Recurring Expenses</h3>
            <button className="expand-btn" onClick={() => navigate("expenses")}>
              View All
              <img src={expand} className="expand-icon" alt="view-all-button" />
            </button>
          </div>

          <div className="recurring-expenses-card">{recurringExpensesArr}</div>
        </div>
      </div>
    </div>
  );
}
