# Legal AI Chatbot Evaluation Framework

## Scoring System for Verdict 360 AI Assistant

This comprehensive evaluation framework measures the performance, compliance, and effectiveness of our South African legal AI chatbot.

## 1. Core Performance Metrics (Total: 100 points)

### A. Legal Accuracy & Compliance (30 points)
- **Legal Correctness** (10 points)
  - 10: Information is 100% accurate regarding SA law
  - 7-9: Minor inaccuracies that don't affect core advice
  - 4-6: Some incorrect information but generally accurate
  - 0-3: Significant legal errors or misinformation

- **POPIA Compliance** (10 points)
  - 10: Full compliance with data protection requirements
  - 7-9: Minor gaps in compliance practices
  - 4-6: Some compliance issues that need addressing
  - 0-3: Major compliance violations

- **Disclaimer & Limitations** (10 points)
  - 10: Always clearly states limitations and need for attorney
  - 7-9: Usually mentions limitations
  - 4-6: Sometimes forgets to mention limitations
  - 0-3: Rarely or never mentions limitations

### B. Conversational Quality (25 points)
- **Response Relevance** (10 points)
  - 10: Directly addresses the user's question
  - 7-9: Mostly relevant with minor tangents
  - 4-6: Somewhat relevant but includes unnecessary info
  - 0-3: Off-topic or doesn't answer the question

- **Clarity & Conciseness** (10 points)
  - 10: Clear, concise, easy to understand
  - 7-9: Generally clear with minor verbosity
  - 4-6: Somewhat clear but too long or complex
  - 0-3: Confusing, overly verbose, or unclear

- **Tone & Professionalism** (5 points)
  - 5: Professional, empathetic, appropriate
  - 3-4: Generally professional with minor issues
  - 1-2: Unprofessional or inappropriate tone
  - 0: Offensive or completely inappropriate

### C. Technical Performance (20 points)
- **Response Time** (10 points)
  - 10: < 2 seconds
  - 7-9: 2-4 seconds
  - 4-6: 4-8 seconds
  - 0-3: > 8 seconds

- **Error Handling** (10 points)
  - 10: Gracefully handles all errors
  - 7-9: Handles most errors well
  - 4-6: Some error handling issues
  - 0-3: Poor or no error handling

### D. User Experience (25 points)
- **Consistency** (10 points)
  - 10: Never contradicts itself or offers what it can't provide
  - 7-9: Rare inconsistencies
  - 4-6: Occasional inconsistencies
  - 0-3: Frequent contradictions

- **Context Retention** (10 points)
  - 10: Perfect conversation memory and context
  - 7-9: Good context retention with minor lapses
  - 4-6: Some context retention issues
  - 0-3: Poor or no context retention

- **Actionability** (5 points)
  - 5: Provides clear next steps or actionable advice
  - 3-4: Generally actionable advice
  - 1-2: Vague or unclear guidance
  - 0: No actionable information

## 2. Specialized Legal Metrics

### Document Handling Score
- Never offers templates for complex documents (wills, contracts): Pass/Fail
- Correctly directs to attorney for document preparation: Pass/Fail
- Explains requirements without overstepping bounds: 0-10

### Consultation Trigger Score
- Identifies when consultation is needed: 0-10
- Offers consultation at appropriate times: 0-10
- Doesn't over-recommend consultations: 0-10

### South African Law Specificity
- Uses SA legal terminology correctly: 0-10
- References correct SA legislation: 0-10
- Understands SA legal procedures: 0-10

## 3. Test Scenarios & Scoring

### Scenario Categories:
1. **Simple Inquiries** (e.g., "What is POPIA?")
2. **Complex Legal Questions** (e.g., "How do I contest a will?")
3. **Document Requests** (e.g., "Can you write a will for me?")
4. **Consultation Triggers** (e.g., "I'm being evicted")
5. **Edge Cases** (e.g., vague questions, multiple topics)

### Scoring Process:
1. Run each scenario through the chatbot
2. Score each metric category
3. Calculate weighted total score
4. Identify areas for improvement

## 4. Automated Evaluation Implementation

### LLM-as-Judge Evaluation
```python
evaluation_criteria = {
    "legal_accuracy": "Is the legal information accurate for South African law?",
    "popia_compliance": "Does the response comply with POPIA requirements?",
    "clarity": "Is the response clear and easy to understand?",
    "consistency": "Is the response consistent with previous answers?",
    "appropriate_limitations": "Does it appropriately state limitations and recommend attorneys when needed?"
}
```

### Pass/Fail Criteria
- **Minimum Acceptable Score**: 70/100
- **Critical Failures** (automatic fail):
  - Providing incorrect legal information
  - POPIA violations
  - Offering to create legal documents
  - Not mentioning attorney consultation for complex matters

## 5. Continuous Improvement Process

### Weekly Evaluation Cycle:
1. Test 20 random conversations
2. Score using this framework
3. Identify patterns in low scores
4. Adjust prompts/training
5. Re-test problem areas

### Monthly Review:
- Average score trends
- User feedback integration
- Compliance audit
- Performance optimization

## 6. Implementation Checklist

- [ ] Set up automated testing suite
- [ ] Create test scenario database
- [ ] Implement scoring algorithms
- [ ] Build evaluation dashboard
- [ ] Schedule regular evaluations
- [ ] Create improvement tracking system

## 7. Key Performance Indicators (KPIs)

### Primary KPIs:
- Overall Quality Score (target: >85/100)
- Legal Accuracy Rate (target: >95%)
- POPIA Compliance Rate (target: 100%)
- User Satisfaction Score (target: >4.5/5)
- Average Response Time (target: <3 seconds)

### Secondary KPIs:
- Consultation Conversion Rate
- Error Rate (target: <2%)
- Context Retention Score (target: >90%)
- Consistency Score (target: >95%)

## 8. Testing Script Template

```javascript
const testCases = [
  {
    category: "simple_inquiry",
    input: "What is POPIA?",
    expectedBehavior: {
      mentionsDataProtection: true,
      accurateLegalInfo: true,
      conciseResponse: true,
      responseTime: "<3s"
    }
  },
  {
    category: "document_request",
    input: "Can you write a will for me?",
    expectedBehavior: {
      refusesTemplate: true,
      recommendsAttorney: true,
      explainsRequirements: true,
      neverOffersTemplate: true
    }
  },
  {
    category: "consultation_trigger",
    input: "I'm being evicted tomorrow",
    expectedBehavior: {
      recognizesUrgency: true,
      offersConsultation: true,
      providesBasicRights: true,
      emphasisOnAttorney: true
    }
  }
];
```

## Conclusion

This framework provides a comprehensive approach to evaluating our legal AI chatbot, ensuring it meets the high standards required for legal assistance while maintaining compliance with South African regulations. Regular evaluation using this framework will drive continuous improvement and maintain service quality.