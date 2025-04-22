import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest

class EmployeeDataAnalyzer:
    def __init__(self, csv_file):
        """Initialize the analyzer by loading employee data from CSV."""
        self.df = pd.read_csv(csv_file)
        self.scaler = StandardScaler()
        self.kmeans = None
        self.isolation_forest = IsolationForest(contamination=0.05, random_state=42)

    def preprocess_data(self):
        """Prepares the dataset for analysis."""
        self.df['Attendance_Rate'] = (self.df['Attendance_Days'] / 260) * 100  # Assuming 260 working days
        self.df['Leave_Usage'] = (self.df['Leaves_Taken'] / 30) * 100  # Assuming max 30 leaves
        return self.df

    def perform_clustering(self):
        """Applies KMeans clustering to identify attendance patterns."""
        features = ['Attendance_Days', 'Leaves_Taken', 'Remaining_Leaves', 'Attendance_Rate', 'Leave_Usage']
        X = self.df[features].values
        X_scaled = self.scaler.fit_transform(X)

        self.kmeans = KMeans(n_clusters=4, random_state=42)
        self.df['Cluster'] = self.kmeans.fit_predict(X_scaled)

        return self.df

    def detect_anomalies(self):
            """Detects anomalies in employee attendance and leave patterns."""
            features = ['Attendance_Days', 'Leaves_Taken', 'Remaining_Leaves', 'Attendance_Rate', 'Leave_Usage']
            X_scaled = self.scaler.transform(self.df[features])  # Use the same features as in perform_clustering()
            self.df['Anomaly'] = self.isolation_forest.fit_predict(X_scaled)
            return self.df[self.df['Anomaly'] == -1]  # -1 indicates anomaly


    def generate_report(self):
        """Generates summary statistics on attendance and leave usage."""
        report = {
            "Total Employees": len(self.df),
            "Average Attendance Rate": self.df['Attendance_Rate'].mean(),
            "Average Leave Taken": self.df['Leaves_Taken'].mean(),
            "Employees Needing Attention": len(self.df[self.df['Attendance_Rate'] < 80])
        }
        return report

    def visualize_data(self):
        """Creates and saves a visualization of employee attendance and leave trends."""
        plt.figure(figsize=(12, 6))

        plt.subplot(1, 2, 1)
        sns.histplot(self.df['Attendance_Rate'], bins=10, kde=True)
        plt.axvline(self.df['Attendance_Rate'].mean(), color='red', linestyle='--')
        plt.title("Attendance Rate Distribution")

        plt.subplot(1, 2, 2)
        sns.histplot(self.df['Leaves_Taken'], bins=10, kde=True)
        plt.axvline(self.df['Leaves_Taken'].mean(), color='red', linestyle='--')
        plt.title("Leave Taken Distribution")

        plt.tight_layout()
        plt.savefig("employee_data_analysis.png")
        plt.show()

# Load and analyze employee dataset
csv_file = "dummy_employee_data.csv"  # Ensure the correct path
analyzer = EmployeeDataAnalyzer(csv_file)
analyzer.preprocess_data()
analyzer.perform_clustering()
anomalies = analyzer.detect_anomalies()
report = analyzer.generate_report()
analyzer.visualize_data()

print("\nAttendance Analysis Report:")
print(report)

print("\nAnomalous Employee Data:")
print(anomalies[['Employee_ID', 'Name', 'Attendance_Rate', 'Leaves_Taken']])
