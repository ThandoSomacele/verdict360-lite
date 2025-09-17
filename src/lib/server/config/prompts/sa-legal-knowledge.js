/**
 * South African Legal Knowledge Base
 * Common legal questions and responses for AI chatbot
 */

module.exports = {
  // Criminal Law
  criminal: {
    arrest: `In South Africa, if you are arrested, you have the right to:
    - Remain silent and not incriminate yourself
    - Be informed of your rights in a language you understand
    - Contact a lawyer of your choice
    - Be brought before a court within 48 hours (or by end of first court day)
    - Apply for bail

    You should exercise your right to remain silent until you have legal representation.`,

    bail: `Bail in South Africa is not automatic. The court considers:
    - The strength of the state's case
    - Your likelihood to appear in court
    - Risk of interfering with witnesses
    - Risk to public safety
    - Your personal circumstances

    Bail applications can be made at your first court appearance or through a formal bail application.`,

    theft: `Theft in South Africa requires proof that you:
    1. Unlawfully took someone else's property
    2. With the intention to permanently deprive them of it

    Penalties range from fines to imprisonment up to 15 years, depending on the value stolen and circumstances.`
  },

  // Family Law
  family: {
    divorce: `South Africa recognizes several grounds for divorce:
    - Irretrievable breakdown of marriage (most common)
    - Mental illness or continuous unconsciousness
    - Adultery, desertion, or other matrimonial offenses

    You can file for uncontested (faster, cheaper) or contested divorce. Uncontested divorce typically takes 4-6 weeks.`,

    custody: `Child custody in South Africa prioritizes the "best interests of the child." Both parents have equal rights. The court considers:
    - Child's emotional and physical needs
    - Each parent's ability to provide care
    - Child's relationship with each parent
    - Stability of living arrangements

    Options include sole custody, joint custody, or shared residence.`,

    maintenance: `Both parents have a duty to maintain their children until age 18 (or longer if in full-time education). Maintenance courts can assist with:
    - Setting maintenance amounts
    - Enforcing payment
    - Garnishee orders against salary
    - Attachment of assets for non-payment`
  },

  // Property Law
  property: {
    transfer: `Property transfer in South Africa requires:
    - Signed deed of sale
    - Bond registration (if applicable)
    - Transfer by conveyancing attorney
    - Payment of transfer duties and fees
    - Registration at Deeds Office

    The process typically takes 6-12 weeks and involves both attorneys and bond originators.`,

    estate: `When someone dies in South Africa:
    - Estate must be reported to Master of High Court within 14 days
    - Executor appointed to wind up estate
    - Assets distributed according to will or intestate succession
    - Estate duties may apply on estates over R3.5 million

    Professional assistance is recommended for estate administration.`
  },

  // Labour Law
  labour: {
    dismissal: `In South Africa, dismissals must be substantively and procedurally fair. Employers must:
    - Have valid reason (misconduct, incapacity, or operational requirements)
    - Follow proper disciplinary procedures
    - Allow employee to respond to allegations
    - Consider alternatives to dismissal

    Unfair dismissal can be challenged at CCMA or Labour Court.`,

    discrimination: `The Employment Equity Act prohibits discrimination based on:
    - Race, gender, pregnancy, disability
    - Religion, age, sexual orientation
    - Family responsibility, political opinion

    Discrimination complaints can be lodged with CCMA, Labour Court, or Equality Court.`,

    ccma: `The CCMA (Commission for Conciliation, Mediation and Arbitration) handles:
    - Unfair dismissal disputes
    - Unfair labour practice complaints
    - Collective bargaining disputes
    - Workplace harassment cases

    Most disputes must be referred within 30 days of the incident.`
  },

  // Commercial Law
  commercial: {
    company: `To register a company in South Africa:
    - Choose unique company name
    - Complete CoR14.1 form
    - Submit to CIPC with required documents
    - Pay registration fees
    - Obtain tax and VAT registration

    Process takes 5-10 business days. Companies must file annual returns and financial statements.`,

    contract: `Valid contracts in South Africa require:
    - Offer and acceptance
    - Consensus (meeting of minds)
    - Capacity to contract
    - Legality of object and purpose
    - Formalities (if required by law)

    Written contracts are recommended for clarity and evidence.`
  },

  // Immigration Law
  immigration: {
    visa: `South Africa has various visa types:
    - Visitor visas (tourism, business, medical)
    - Work visas (general, critical skills, intra-company)
    - Study visas
    - Family/spouse visas
    - Permanent residence

    Applications must be made before current visa expires. Each type has specific requirements.`,

    permit: `Work permits in South Africa require:
    - Job offer from SA employer
    - Proof of qualifications
    - Medical and radiological certificates
    - Police clearance certificates
    - Proof employer couldn't find local candidate

    Processing times vary from 2-8 weeks depending on permit type.`
  },

  // Consumer Protection
  consumer: {
    cpa: `The Consumer Protection Act gives you rights to:
    - Return defective goods within 6 months
    - Cancel contracts within cooling-off periods
    - Fair and responsible marketing
    - Plain language in contracts
    - Protection from unfair contract terms

    Complaints can be lodged with National Consumer Commission.`
  },

  // General Legal Advice
  general: {
    legal_aid: `Legal Aid South Africa provides free legal services to those who:
    - Earn less than R5,500 per month (individuals)
    - Qualify means test
    - Have meritorious case

    Services include criminal defense, civil matters, and family law cases.`,

    court_process: `South African court hierarchy:
    - Magistrate's Courts (criminal and civil matters up to R400,000)
    - High Courts (serious crimes, civil matters over R400,000, appeals)
    - Supreme Court of Appeal
    - Constitutional Court (constitutional matters)

    Most matters start in Magistrate's Courts.`
  }
};