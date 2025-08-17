
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { styles } from '../../styles/styles';
import { LOAN_TERMS, CREDIT_SCORE_RANGES, INTEREST_RATES } from '../../utils/constants';

const FinancingModule = () => {
  const { state, dispatch } = useApp();
  
  const [loanData, setLoanData] = useState({
    vehicleId: '',
    customerId: '',
    vehiclePrice: 25000,
    downPayment: 5000,
    tradeInValue: 0,
    interestRate: 8.5,
    loanTerm: 60,
    taxRate: 8.25,
    fees: 750,
    insuranceRequired: true,
    gapInsurance: false
  });

  const [calculatedLoan, setCalculatedLoan] = useState(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [loanStatus, setLoanStatus] = useState('draft'); // draft, approved, funded

  // Get selected customer and vehicle data
  const selectedCustomer = state.customers.find(c => c.id.toString() === loanData.customerId);
  const selectedVehicle = state.vehicles.find(v => v.id.toString() === loanData.vehicleId);

  // Auto-update vehicle price when vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      setLoanData(prev => ({ ...prev, vehiclePrice: selectedVehicle.price }));
    }
  }, [selectedVehicle]);

  // Calculate loan details
  const calculateLoan = () => {
    const vehiclePrice = parseFloat(loanData.vehiclePrice) || 0;
    const downPayment = parseFloat(loanData.downPayment) || 0;
    const tradeInValue = parseFloat(loanData.tradeInValue) || 0;
    const taxRate = parseFloat(loanData.taxRate) || 0;
    const fees = parseFloat(loanData.fees) || 0;
    const interestRate = parseFloat(loanData.interestRate) || 0;
    const loanTerm = parseInt(loanData.loanTerm) || 60;

    // Calculate tax on vehicle price minus trade-in
    const taxableAmount = vehiclePrice - tradeInValue;
    const tax = (taxableAmount * taxRate) / 100;
    
    // Calculate principal loan amount
    const principal = vehiclePrice + tax + fees - downPayment - tradeInValue;
    
    if (principal <= 0) {
      return {
        principal: 0,
        tax,
        monthlyPayment: 0,
        totalInterest: 0,
        totalCost: vehiclePrice + tax + fees,
        loanToValue: 0,
        debtToIncome: 0
      };
    }

    // Calculate monthly payment using loan formula
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    let monthlyPayment;
    if (monthlyRate > 0) {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = principal / numberOfPayments;
    }
    
    const totalInterest = (monthlyPayment * numberOfPayments) - principal;
    const totalCost = vehiclePrice + tax + fees + totalInterest;
    
    // Calculate ratios
    const loanToValue = (principal / vehiclePrice) * 100;
    const debtToIncome = selectedCustomer ? 
      ((monthlyPayment * 12) / (selectedCustomer.monthlyIncome * 12)) * 100 : 0;

    return {
      vehiclePrice,
      downPayment,
      tradeInValue,
      tax,
      fees,
      principal,
      monthlyPayment,
      totalInterest,
      totalCost,
      loanToValue,
      debtToIncome,
      numberOfPayments
    };
  };

  // Update calculations when loan data changes
  useEffect(() => {
    setCalculatedLoan(calculateLoan());
  }, [loanData, selectedCustomer]);

  // Get recommended interest rate based on credit score
  const getRecommendedRate = (creditScore) => {
    if (creditScore >= 800) return { min: 3.5, max: 5.0, tier: 'Super Prime' };
    if (creditScore >= 740) return { min: 5.0, max: 7.0, tier: 'Prime' };
    if (creditScore >= 670) return { min: 7.0, max: 10.0, tier: 'Near Prime' };
    if (creditScore >= 580) return { min: 10.0, max: 15.0, tier: 'Subprime' };
    return { min: 15.0, max: 20.0, tier: 'Deep Subprime' };
  };

  const recommendedRate = selectedCustomer ? getRecommendedRate(selectedCustomer.creditScore) : null;

  // Generate amortization schedule
  const generateAmortizationSchedule = (monthsToShow = 12) => {
    if (!calculatedLoan || calculatedLoan.principal <= 0) return [];
    
    const schedule = [];
    let remainingBalance = calculatedLoan.principal;
    const monthlyRate = loanData.interestRate / 100 / 12;
    
    for (let month = 1; month <= Math.min(monthsToShow, loanData.loanTerm); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = calculatedLoan.monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);
      
      schedule.push({
        month,
        payment: calculatedLoan.monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance
      });
    }
    
    return schedule;
  };

  const amortizationSchedule = generateAmortizationSchedule(showAmortization ? 24 : 12);

  // Loan approval logic
  const getLoanApprovalStatus = () => {
    if (!selectedCustomer || !calculatedLoan) return { status: 'pending', message: 'Select customer to evaluate' };
    
    const { creditScore, monthlyIncome } = selectedCustomer;
    const { debtToIncome, loanToValue } = calculatedLoan;
    
    if (creditScore < 500) return { status: 'declined', message: 'Credit score too low' };
    if (debtToIncome > 40) return { status: 'declined', message: 'Debt-to-income ratio too high' };
    if (loanToValue > 120) return { status: 'review', message: 'High loan-to-value ratio - requires review' };
    if (creditScore >= 650 && debtToIncome <= 25) return { status: 'approved', message: 'Pre-approved for financing' };
    
    return { status: 'review', message: 'Requires manual review' };
  };

  const approvalStatus = getLoanApprovalStatus();

  // Handle loan processing
  const handleProcessLoan = () => {
    if (approvalStatus.status === 'approved') {
      setLoanStatus('approved');
      // Here you would typically save to backend or update state
      alert('Loan has been approved and processed!');
    } else {
      alert('Loan requires additional review before processing.');
    }
  };

  const handleSaveDraft = () => {
    // Save loan as draft - typically to backend
    setLoanStatus('draft');
    alert('Loan application saved as draft.');
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2937' }}>Financing Module</h2>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Calculate payments and process auto loans
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
          <button 
            style={{
              ...styles.button, 
              ...(approvalStatus.status === 'approved' ? styles.buttonSuccess : styles.buttonPrimary)
            }}
            onClick={handleProcessLoan}
            disabled={!selectedCustomer || !calculatedLoan}
          >
            {approvalStatus.status === 'approved' ? 'Process Approved Loan' : 'Submit for Review'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column - Input Form */}
        <div>
          {/* Customer & Vehicle Selection */}
          <div style={{...styles.card, marginBottom: '1.5rem'}}>
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Customer & Vehicle Selection</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Customer:
                </label>
                <select
                  value={loanData.customerId}
                  onChange={(e) => setLoanData({...loanData, customerId: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                >
                  <option value="">Select Customer...</option>
                  {state.customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - Credit Score: {customer.creditScore}
                    </option>
                  ))}
                </select>
                {selectedCustomer && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.75rem', 
                    background: recommendedRate?.tier === 'Super Prime' ? '#dcfce7' : 
                               recommendedRate?.tier === 'Prime' ? '#dbeafe' :
                               recommendedRate?.tier === 'Near Prime' ? '#fef3c7' : '#fee2e2',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      Credit Tier: {recommendedRate?.tier}
                    </div>
                    <div>Recommended Rate: {recommendedRate?.min}% - {recommendedRate?.max}%</div>
                    <div>Monthly Income: {formatCurrency(selectedCustomer.monthlyIncome)}</div>
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Vehicle:
                </label>
                <select
                  value={loanData.vehicleId}
                  onChange={(e) => setLoanData({...loanData, vehicleId: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                >
                  <option value="">Select Vehicle...</option>
                  {state.vehicles.filter(v => v.status === 'Available').map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - {formatCurrency(vehicle.price)}
                    </option>
                  ))}
                </select>
                {selectedVehicle && (
                  <div style={{ 
                    marginTop: '0.5rem',
                    fontSize: '0.9rem',
                    color: '#6b7280'
                  }}>
                    VIN: {selectedVehicle.vin} | Mileage: {formatNumber(selectedVehicle.mileage)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loan Calculator */}
          <div style={styles.card}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Loan Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Vehicle Price:
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={loanData.vehiclePrice}
                  onChange={(e) => setLoanData({...loanData, vehiclePrice: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Down Payment:
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={loanData.downPayment}
                  onChange={(e) => setLoanData({...loanData, downPayment: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Trade-In Value:
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={loanData.tradeInValue}
                  onChange={(e) => setLoanData({...loanData, tradeInValue: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Interest Rate (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={loanData.interestRate}
                  onChange={(e) => setLoanData({...loanData, interestRate: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                />
                {recommendedRate && (
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Suggested: {recommendedRate.min}% - {recommendedRate.max}%
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Loan Term:
                </label>
                <select
                  value={loanData.loanTerm}
                  onChange={(e) => setLoanData({...loanData, loanTerm: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                >
                  {LOAN_TERMS.map(term => (
                    <option key={term} value={term}>
                      {term} months ({Math.round(term/12)} years)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Tax Rate (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.1"
                  value={loanData.taxRate}
                  onChange={(e) => setLoanData({...loanData, taxRate: e.target.value})}
                  style={{...styles.input, marginTop: 0}}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Additional Fees:
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={loanData.fees}
                onChange={(e) => setLoanData({...loanData, fees: e.target.value})}
                style={{...styles.input, marginTop: 0}}
                placeholder="Documentation, processing fees, etc."
              />
            </div>

            {/* Optional Services */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={loanData.insuranceRequired}
                  onChange={(e) => setLoanData({...loanData, insuranceRequired: e.target.checked})}
                />
                <span>Insurance Required</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={loanData.gapInsurance}
                  onChange={(e) => setLoanData({...loanData, gapInsurance: e.target.checked})}
                />
                <span>GAP Insurance</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Results & Analysis */}
        <div>
          {/* Monthly Payment Display */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Monthly Payment</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {calculatedLoan ? formatCurrency(calculatedLoan.monthlyPayment) : '\$0'}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>
              for {loanData.loanTerm} months
            </div>
          </div>

          {/* Loan Summary */}
          <div style={{...styles.card, marginBottom: '1.5rem'}}>
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Loan Summary</h3>
            {calculatedLoan && (
              <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vehicle Price:</span>
                  <span style={{ fontWeight: '600' }}>{formatCurrency(calculatedLoan.vehiclePrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Down Payment:</span>
                  <span style={{ color: '#10b981' }}>-{formatCurrency(calculatedLoan.downPayment)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Trade-In Value:</span>
                  <span style={{ color: '#10b981' }}>-{formatCurrency(calculatedLoan.tradeInValue)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax:</span>
                  <span>{formatCurrency(calculatedLoan.tax)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Fees:</span>
                  <span>{formatCurrency(calculatedLoan.fees)}</span>
                </div>
                <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '600' }}>
                  <span>Amount Financed:</span>
                  <span>{formatCurrency(calculatedLoan.principal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Interest:</span>
                  <span style={{ color: '#ef4444' }}>{formatCurrency(calculatedLoan.totalInterest)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '600' }}>
                  <span>Total Cost:</span>
                  <span>{formatCurrency(calculatedLoan.totalCost)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Loan Analysis */}
          <div style={{...styles.card, marginBottom: '1.5rem'}}>
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Loan Analysis</h3>
            {calculatedLoan && selectedCustomer && (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Loan-to-Value Ratio:</span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: calculatedLoan.loanToValue > 100 ? '#fee2e2' : '#dcfce7',
                    color: calculatedLoan.loanToValue > 100 ? '#dc2626' : '#166534'
                  }}>
                    {calculatedLoan.loanToValue.toFixed(1)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Debt-to-Income Ratio:</span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: calculatedLoan.debtToIncome > 35 ? '#fee2e2' : '#dcfce7',
                    color: calculatedLoan.debtToIncome > 35 ? '#dc2626' : '#166534'
                  }}>
                    {calculatedLoan.debtToIncome.toFixed(1)}%
                  </span>
                </div>
                <div style={{ 
                  marginTop: '1rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: approvalStatus.status === 'approved' ? '#dcfce7' : 
                             approvalStatus.status === 'declined' ? '#fee2e2' : '#fef3c7',
                  color: approvalStatus.status === 'approved' ? '#166534' : 
                         approvalStatus.status === 'declined' ? '#dc2626' : '#92400e'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    Status: {approvalStatus.status.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>{approvalStatus.message}</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={styles.card}>
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <button 
                style={{...styles.button, ...styles.buttonPrimary, justifyContent: 'center'}}
                onClick={() => setShowAmortization(!showAmortization)}
              >
                {showAmortization ? 'Hide' : 'Show'} Full Amortization Schedule
              </button>
              <button 
                style={{...styles.button, ...styles.buttonSecondary, justifyContent: 'center'}}
                onClick={() => window.print()}
              >
                Print Loan Details
              </button>
              <button 
                style={{...styles.button, ...styles.buttonSuccess, justifyContent: 'center'}}
                disabled={!selectedCustomer || !selectedVehicle}
                onClick={() => alert('Feature coming soon: Email quote to customer')}
              >
                Email Quote to Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div style={{...styles.card, marginTop: '2rem'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>
            Payment Schedule {showAmortization ? '(24 months)' : '(First 12 months)'}
          </h3>
          <button 
            style={{...styles.button, ...styles.buttonSecondary, padding: '0.5rem 1rem'}}
            onClick={() => setShowAmortization(!showAmortization)}
          >
            {showAmortization ? 'Show Less' : 'Show More'}
          </button>
        </div>
        
        {calculatedLoan && calculatedLoan.principal > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ 
                  borderBottom: '2px solid #e5e7eb', 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' 
                }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Payment #</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Payment Amount</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Principal</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Interest</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((row, index) => (
                  <tr key={row.month} style={{ 
                    borderBottom: '1px solid #f3f4f6',
                    background: index % 2 === 0 ? 'white' : '#f9fafb'
                  }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{row.month}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      {formatCurrency(row.payment)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#10b981' }}>
                      {formatCurrency(row.principal)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#ef4444' }}>
                      {formatCurrency(row.interest)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatCurrency(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Enter loan details to see payment schedule
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancingModule;