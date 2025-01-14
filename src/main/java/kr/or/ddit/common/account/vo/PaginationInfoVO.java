package kr.or.ddit.common.account.vo;

import java.util.List;

import kr.or.ddit.common.mail.vo.MailVO;
import lombok.Data;

@Data
public class PaginationInfoVO<T> {
	// 이건 메일에서 필요해서 넣음
	private int memNo;
	private int keyword;
	private int mailboxNo; 
	private List<MailVO> confirmationMailList;
	private int totalRecord;			// 총 게시글 수
	private int totalPage;				// 총 페이지 수
	private int currentPage;			// 현재 페이지
	private int screenSize;				// 페이지 당 게시글 수
	private int blockSize;				// 페이지 블록 수
	private int startRow;				// 시작 row
	private int endRow;					// 끝 row
	private int startPage;				// 시작 페이지
	private int endPage;				// 끝 페이지
	private List<T> dataList;			// 결과를 넣을 데이터 리스트(각 페이지당 조회된 목록 데이터)
	private String searchType;			// 검색 타입(제목,작성자,작성일 등등)
	private String searchWord;			// 검색 키워드
	
	private String postType;			// 게시판타입
	
	public PaginationInfoVO() {}
	
	// PaginationInfoVO 객체를 만들 때, 한 페이지당 게시글 수와 페이지 블록 수를 원하는 값으로 초기화 할 수 있다.
	public PaginationInfoVO(int screenSize, int blockSize) {
		this.screenSize = screenSize;
		this.blockSize = blockSize;
	}
	
	public void setTotalRecord(int totalRecord) {
		// 총 게시글수를 저장하고, 총 게시글 수를 페이지 당 나타낼 게시글 수로 나눠 총 페이지수를 구한다.
		this.totalRecord = totalRecord;
		// ceil은 올림
		totalPage = (int)Math.ceil(totalRecord / (double)screenSize);
	}
	
	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;				// 현재 페이지 설정
		endRow = currentPage * screenSize;			// 끝 row = 현재 페이지 * 한 페이지당 게시글 수
		startRow = endRow - (screenSize - 1);		// 시작 row = 끝 row - (한 페이지당 게시글 수 - 1)
		// 마지막 페이지 = (현재 페이지 + (페이지 블록 사이즈 - 1)) / 페이지 블록 사이즈 * 페이지 블록 사이즈
		// '/ blockSize * blockSize는 1,2,3,4,5... 페이지마다 실수 계산이 아닌 정수 계산을 이용해 endPage를 구하기 위함.
		endPage = (currentPage + (blockSize - 1)) / blockSize * blockSize;
		startPage = endPage - (blockSize - 1);		// 시작 페이지 = 마지막 페이지 - (페이지 블록 사이즈 - 1) 
	}
	
	public String getPagingHTML() {
	    StringBuffer html = new StringBuffer();
	    System.out.println(this);
	    if (totalPage > 0) {
	    	html.append("<ul class='pagination pagination-sm m-0 float-right'>");
	    	
	    	if (startPage > 1) {
	    		html.append("<li class='page-item'><a href='' class='page-link' data-page='" + (startPage - blockSize) + "'><span class='fas fa-chevron-left'></span></a></li>");
	    	}
	    	
	    	for (int i = startPage; i <= (endPage < totalPage ? endPage : totalPage); i++) {
	    		if (i == currentPage) {
	    			html.append("<li class='page-item active'><span class='page-link'>" + i + "</span></li>");
	    		} else {
	    			html.append("<li class='page-item'><a href='' class='page-link' data-page='" + i + "'>" + i + "</a></li>");
	    		}
	    	}
	    	
	    	if (endPage < totalPage) {
	    		html.append("<li class='page-item'><a href='' class='page-link' data-page='" + (endPage + 1) + "'><span class='fas fa-chevron-right'></span></a></li>");
	    	}
	    	
	    	html.append("</ul>");
		}
	    System.out.println(html);
	    return html.toString();
	}
}


















