const TrackRecord = () => {

    return (
        <section
            style={{
                backgroundColor: "#042b62",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                textAlign: "center",
                padding: "16px",
            }}
        >
            <h2
                style={{
                    fontSize: 24,
                    fontWeight: 600,
                    marginBottom: 6,
                }}
            >
                Our Track Record
            </h2>

            <p
                style={{
                    fontSize: 14,
                    marginBottom: 20,
                }}
            >
                Consistent outperformance backed by data
            </p>

            <div
                style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    maxWidth: 420,
                    margin: "0 auto",
                    padding: 28,
                }}
            >
                <h3
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        textAlign: "left",
                        // marginBottom: 24,
                    }}
                >
                    10-Year CAGR Comparison
                </h3>

                {/* Fintoo Portfolio */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                    }}
                >
                    <span>Fintoo Portfolio</span>
                    <span style={{ color: '#FFB400' }}>30.31%</span>
                </div>

                <div
                    style={{
                        width: "100%",
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#395977",
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            width: "30.31%",
                            height: "100%",
                            borderRadius: 4,
                            backgroundColor: "#FFB400",
                        }}
                    />
                </div>

                {/* Nifty 50 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                    }}
                >
                    <span>Nifty 50</span>
                    <span>17.12%</span>
                </div>

                <div
                    style={{
                        width: "100%",
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#395977",
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            width: "17.12%",
                            height: "100%",
                            borderRadius: 4,
                            backgroundColor: "#b9c9da",
                        }}
                    />
                </div>

                <div
                    style={{
                        fontSize: 10,
                        opacity: 0.6,
                        textAlign: "left",
                    }}
                >
                    * Back-tested results using actual strategy simulations
                </div>

                <div
                    style={{
                        backgroundColor: "#2f557d",
                        borderRadius: 14,
                        padding: "16px",
                        marginTop: 20,
                    }}
                >
                    <div
                        style={{
                            fontSize: 36,
                            fontWeight: 700,
                            marginBottom: 6,
                            color: '#FFB400'
                        }}
                    >
                        13.19%
                    </div>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 2,
                        }}
                    >
                        Outperformance
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            opacity: 0.8,
                        }}
                    >
                        Average annual excess returns
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrackRecord;
