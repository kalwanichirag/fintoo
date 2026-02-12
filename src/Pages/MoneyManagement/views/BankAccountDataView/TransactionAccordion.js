import { useEffect, useState } from 'react';
import style from '../../style.module.css';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { updateCreditDebit, updateSubTransaction } from './transactionObjUpdate';
import { indianRupeeFormat } from '../../../../common_utilities';

const customStyles = {
    option: (base, { isFocused, isSelected }) => {
        return {
            ...base,
            backgroundColor: '#ffff',
            color: isFocused ? '#00759D' : isSelected ? '#00759D' : 'rgba(0, 82, 99, 0.50)',
            cursor: 'pointer',
            position: 'relative',
            fontSize: '1rem !important'
        };
    },
    placeholder: (base) => {
        return {
            ...base,
            fontSize: '1.25rem !important'
        };
    },
    singleValue: (base) => {
        return {
            ...base,
            fontSize: '1.25rem !important'
        };
    },
    menuList: (base) => ({
        ...base,
        overflowY: 'scroll',
        scrollBehavior: 'smooth',
        '::-webkit-scrollbar': {
            width: '4px',
            height: '0px',
        },
        '::-webkit-scrollbar-track': {
            background: '#fff',
        },
        '::-webkit-scrollbar-thumb': {
            background: '#424242',
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: '#555',
        },
    }),
};

const indianRupees = (balance) => {
    const currentBal = indianRupeeFormat(balance);
    if (currentBal.endsWith(".00")) {
        const trimmedBal = currentBal.slice(0, -3);
        return trimmedBal;
    } else {
        return currentBal;
    }
};

function TransactionAccordion({ filterStateData, transaction, getCatOptions, getCatSelectVal, getMainCatSelectVal, indexNo, accordionArr, setAccordionArr, setAllTransactionsObj }) {

    const [paginatedTransactionList, setPaginatedTransactionList] = useState([]);

    const [totalPages, setTotalPages] = useState(0)

    const [paginationData, setPaginationData] = useState({
        currentPageNo: 0,
        recordsPerPage: 10
    })

    const handlePageClick = ({ selected }) => {
        setPaginationData(prev => ({ ...prev, currentPageNo: selected }));
    };

    const handlePagination = () => {
        setTotalPages(Math.ceil(transaction.transaction_list.length / paginationData.recordsPerPage))

        const indexOfLastTransaction = (paginationData.currentPageNo + 1) * paginationData.recordsPerPage;
        const calculatedIndexOfFirstTransaction = paginationData.currentPageNo * paginationData.recordsPerPage;

        setPaginatedTransactionList(() => transaction.transaction_list.slice(calculatedIndexOfFirstTransaction, indexOfLastTransaction))
    }

    const expandPanel = (item) => {
        setAccordionArr(prev => [...prev, item])
    }

    const collapsePanel = (item) => {
        const index = accordionArr.indexOf(item);
        if (index !== -1) {
            setAccordionArr(prev => prev.filter(i => i !== item))
        }
    }

    const updateMainCategory = (id, isChecked, categoryName, isCheckboxUpdate, isSelectUpdate) => {
        setAllTransactionsObj((prev) => updateCreditDebit(prev, id, isChecked, categoryName, isCheckboxUpdate, isSelectUpdate))
    }

    const updateSubCatArr = (mainCatId, id, isChecked, categoryName) => {
        setAllTransactionsObj((prev) => updateSubTransaction(prev, mainCatId, id, isChecked, categoryName))
    }

    const reverseDateFormat = (dateStr) => {
        const dateStrArr = dateStr.split('-');

        return `${dateStrArr[2]}-${dateStrArr[1]}-${dateStrArr[0]}`
    }

    useEffect(() => {
        handlePagination()
    }, [transaction, paginationData])

    const getMainCatSelectValForHeading = (transaction) => {
        const catObj = getMainCatSelectVal(transaction.selectedCat, true);
        return catObj.label;
    }





    return (
        <div div className='mapTransaction'>
            <div
                className={`${style.bankAccountDataTransactionTableActiveRow}`}
                style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderBottom: '1px solid #e1e1e1', backgroundColor: '#f3f3f3', borderRadius: `${indexNo == 0 ? "10px 10px 0 0" : "0"}`, cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); accordionArr.includes(transaction.id) ? collapsePanel(transaction.id) : expandPanel(transaction.id) }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '45%', fontSize: '1.25rem' }}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" name="" id="" checked={transaction.isChecked} onChange={() => updateMainCategory(transaction.id, !transaction.isChecked, transaction.selectedCat, true, false)} />
                    </div>
                    <div>{transaction?.narration_key ?? getMainCatSelectValForHeading(transaction) ?? ''}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', paddingLeft: '1rem' }}>
                    <div>{indianRupees(transaction.total_amount)}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto', width: '19%' }} >
                    <div className={'mapTransactionSelectEmpty'} onClick={(e) => e.stopPropagation()} style={{ width: '100%' }}>
                        <Select
                            options={getCatOptions(filterStateData.mappingStatus == 'Mapped')}
                            placeholder="Select Category"
                            styles={customStyles}
                            classNamePrefix="sortSelect"
                            isSearchable={false}
                            value={getMainCatSelectVal(transaction.selectedCat, true)}
                            onChange={(selectedOption) =>
                                updateMainCategory(transaction.id, transaction.isChecked, selectedOption.value, false, true)
                            }
                        />
                    </div>
                    <div>
                        {
                            accordionArr.includes(transaction.id) ? <span style={{ fontSize: '2rem' }}>
                                -
                            </span> : <span style={{ fontSize: '2rem' }}>
                                +
                            </span>
                        }

                    </div>
                </div>
            </div>

            {
                accordionArr.includes(transaction.id) && <div style={{ padding: '1rem' }}>
                    <table style={{ width: '100%', borderRadius: '10px', border: '1px solid #e1e1e1', borderCollapse: 'collapse', borderStyle: 'hidden', boxShadow: '0 0 0 1px #e1e1e1', marginBottom: '0.5rem' }} >
                        <thead className={`${style.bankAccountDataTransactionTableHead}`} style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                            <th style={{ width: '5%', borderTopLeftRadius: '10px' }}></th>
                            <th style={{ width: '40%' }}>Narration</th>
                            <th style={{ width: '15%' }}>Transaction Date</th>
                            <th style={{ width: '20%' }}>Amount</th>
                            <th style={{ width: '20%', borderTopRightRadius: '10px' }}>Category</th>
                        </thead>

                        <tbody >
                            {/* <div > */}
                            {
                                paginatedTransactionList.map((data, idx) =>
                                    // transaction.transaction_list.map((data, idx) =>
                                    <tr
                                        key={idx}
                                        className={`${style.bankAccountDataTransactionTableActiveRow}`}
                                        style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}
                                    >
                                        <td style={{ width: '5%' }}>
                                            <input type="checkbox" name="" id="" checked={data.isChecked} onChange={() => updateSubCatArr(transaction.id, data.txnId, !data.isChecked, data.selectedCat)} />
                                        </td>
                                        <td style={{ width: '40%' }}>{data.narration}</td>
                                        <td style={{ width: '15%' }}>{reverseDateFormat(data.date)}</td>
                                        <td style={{ width: '20%' }}>{indianRupees(data.amount)}</td>
                                        {/* <td>{transaction?.narration_key ?? transaction?.category ?? ''}</td> */}
                                        <td className={(getCatSelectVal(data, data.isMapped)).value === '' ? 'mapTransactionSelectEmpty' : 'mapTransactionSelect'} style={{ width: '20%' }}>
                                            <Select
                                                options={getCatOptions(data.isMapped)}
                                                placeholder="Select Category"
                                                styles={customStyles}
                                                classNamePrefix="sortSelect"
                                                isSearchable={false}
                                                // value={getCatSelectVal(data, true)}
                                                value={getMainCatSelectVal(data.category, true)}
                                                onChange={(selectedOption) =>
                                                    updateSubCatArr(transaction.id, data.txnId, data.isChecked, selectedOption.value)
                                                }
                                            />
                                        </td>
                                    </tr>
                                )
                            }
                            {/* </div> */}

                        </tbody >
                    </table>
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-end"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={'active'}
                        forcePage={paginationData.currentPageNo == undefined ? 0 : paginationData.currentPageNo}
                    />
                </div>
            }
        </div>
    );
}

export default TransactionAccordion;
