import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from '../components/FileUpload';

// Interfaces for analysis result data
interface AnalysisIssue {
  issue: string;
  description: string;
  suggestion: string;
  element?: string;
}

interface AnalysisResult {
  complianceScore: number;
  issues: AnalysisIssue[];
}

const Home: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: string) => {
    setError(error);
    setTimeout(() => setError(null), 5000);
  };

  const handleResult = (data: AnalysisResult) => {
    setResult(data);
  };

  return (
    <Container>
      <Header>
        <Title>HTML Accessibility Analyzer</Title>
      </Header>
      
      <Main>
        <FileUpload onResult={handleResult} onRemove={() => setResult(null)} onError={handleError} />
        
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        
        {result && (
          <Section aria-labelledby="results-heading">
            <SectionTitle id="results-heading">Analysis Results</SectionTitle>
            <p>
              Compliance Score: <strong style={{ color: result.complianceScore >= 50 ? '#1b1b1b' : 'red'}}>{result.complianceScore}</strong>
            </p>
            <p>
              Issues Identified: <strong>{result.issues.length}</strong>
            </p>
            {result.issues.length > 0 ? (
              <IssueList>
                {result.issues.map((issue, index) => (
                  <IssueItem key={index}>
                    <p>
                      <strong>{issue.issue}</strong>
                    </p>
                    <p>{issue.description}</p>
                    <p>
                      <em>Suggestion: {issue.suggestion}</em>
                    </p>
                  </IssueItem>
                ))}
              </IssueList>
            ) : (
              <p>No accessibility issues found. Great job!</p>
            )}
          </Section>
        )}
      </Main>
      
      <Footer>
        &copy; {new Date().getFullYear()} Accessibility Analyzer
      </Footer>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  width: 100vw;
  @media(max-width: 768px) {
    width: 90vw;
    padding: 5vw;
  }
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.header`
  width: 100%;
  max-width: 768px;
  margin: 16px 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
`;

const Main = styled.main`
  width: 100%;
  max-width: 768px;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media(max-width: 768px) {
    width: auto;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #fecaca;
  color: #b91c1c;
  border-radius: 4px;
`;

const Section = styled.section`
  margin-top: 24px;
  color: #1b1b1b;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
`;

const IssueList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IssueItem = styled.li`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const Footer = styled.footer`
  margin-top: 32px;
  font-size: 0.875rem;
  color: #6b7280;
`;
