package com.wpc.admin.service;

import com.wpc.admin.entity.User;
import com.wpc.common.BaseService;

/**
 * 操作相关
 */
public interface UserService extends BaseService<User, Integer> {
	
	public final static String BEAN_ID="userService";
	

}