
// MFCFileTreeDlg.h: 头文件
//

#pragma once


// CMFCFileTreeDlg 对话框
class CMFCFileTreeDlg : public CDialogEx
{
// 构造
public:
	CMFCFileTreeDlg(CWnd* pParent = nullptr);	// 标准构造函数

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_MFCFILETREE_DIALOG };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV 支持


// 实现
protected:
	HICON m_hIcon;

	// 生成的消息映射函数
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:
	CTreeCtrl m_tree;
	CListBox m_list;
	HTREEITEM m_hRoot;
	afx_msg void CMFCFileTreeDlg::DfsTree(CString filePath, HTREEITEM handle);
	afx_msg void OnTvnSelchangedTree1(NMHDR* pNMHDR, LRESULT* pResult);
	CString CMFCFileTreeDlg::GetFullPath(HTREEITEM hCurrent);
};
