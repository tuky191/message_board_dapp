import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../../DiscussionBoard.css";
function Paginator ({ itemsPerPage, items }) {

    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(items);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    function Items({ currentItems }) {
        return (
            <>
                {currentItems &&
                    currentItems.map((item) => (
                        <div>
                            {item}
                        </div>
                    ))}
            </>
        );
    }

        useEffect(() => {
            console.log(items)
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(items.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(items.length / itemsPerPage));
        }, [itemOffset, itemsPerPage, items]);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % items.length;
            setCurrentPage(event.selected)
            console.log(
                `User requested page number ${event.selected}, which is offset ${newOffset}`
            );
            setItemOffset(newOffset);
        };

        return (
            <div className="container" >
                <div className="container-pagination"> 
                <Items currentItems={currentItems} />
            </div>
            <div className='pagination pagination-sm pagination-circle justify-content-center mb-0'>
                    <ReactPaginate
                        breakLabel="..."
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        renderOnZeroPageCount={null}
                        forcePage={currentPage}
                        marginPagesDisplayed={5}
                        previousLabel='Previous'
                        nextLabel='Next'
                        breakClassName='page-item'
                        containerClassName='pagination'
                        pageClassName='page-item'
                        pageLinkClassName='page-link'
                        previousClassName='page-item'
                        nextClassName='page-item'
                        previousLinkClassName='page-link'
                        nextLinkClassName='page-link'
                        />
            </div>
            </div>
        );
    }


export default Paginator