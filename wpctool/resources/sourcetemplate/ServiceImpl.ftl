package ${basePackage}.${moduleName}.${servicePackage}.${serviceImplPackage};

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import ${basePackage}.${moduleName}.${daoPackage}.${entityCamelName}Dao;
import ${basePackage}.${moduleName}.${entityPackage}.${entityCamelName};
import ${basePackage}.${moduleName}.${servicePackage}.${entityCamelName}Service;
import ${basePackage}.common.BaseServiceImpl;

/**
 * ${remark!}操作相关
 * author wpc
 */
@Service(${entityCamelName}Service.BEAN_ID)
public class ${entityCamelName}ServiceImpl extends BaseServiceImpl<${entityCamelName}, ${primaryPropertyType}> implements ${entityCamelName}Service {

	Logger logger = LoggerFactory.getLogger(${entityCamelName}ServiceImpl.class);

	@Resource(name=${entityCamelName}Dao.BEAN_ID)
	private ${entityCamelName}Dao ${entityName}Dao;

	<#if module.persistance!="mybatis">

	@Override
	public void save${entityCamelName}(${entityCamelName} ${entityName}) {
		${entityName}Dao.save${entityCamelName}(${entityName});
	}

	@Override
	public void update${entityCamelName}(${entityCamelName} ${entityName}) {
		${entityName}Dao.update${entityCamelName}(${entityName});
	}

	@Override
	public void remove${entityCamelName}(${entityCamelName} ${entityName}) {
		${entityName}Dao.delete${entityCamelName}(${entityName});
	}

	@Override
	public ${entityCamelName} loadById(${primaryPropertyType} ${primaryProperty}) {
		return ${entityName}Dao.findById(${primaryProperty});
	}

	@Override
	public void load${entityCamelName}List(Pagination<${entityCamelName}> page,
			Map<String, Object> params) {
		<#if module.persistance=="mybatis">
		if (page.getPageSize()>0){
			Integer total = ${entityName}Dao.count${entityCamelName}(params);
			if (total==0){
				return;
			}
			page.setEntityCount(total);
		}
		List<${entityCamelName}> list = ${entityName}Dao.find${entityCamelName}List(page,params);
		page.setEntities(list);
		<#elseif module.persistance=="hibernate">
		${entityName}Dao.find${entityCamelName}List(page,params);
		<#else>
		${entityName}Dao.find${entityCamelName}ListByJdbc(page,params);
		</#if>
	}
	
	</#if>

}
