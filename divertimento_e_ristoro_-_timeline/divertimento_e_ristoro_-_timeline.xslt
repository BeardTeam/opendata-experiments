<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="text" indent="no"/>
<xsl:template match="items">
[
<xsl:call-template name="item"/>
]
</xsl:template>

<xsl:template  name="item">
	<xsl:for-each select="//item">
	{
	'id':'<xsl:value-of select="id"/>',
	'label':'<xsl:value-of select="nome"/>',
	'indirizzo':<xsl:value-of select="indirizzo"/>',
	'cap':<xsl:value-of select="cap"/>',
	'citta':<xsl:value-of select="citta"/>',
	'geolocazione':<xsl:value-of select="geolocazione"/>',
	'telefono':<xsl:value-of select="telefono"/>',
	'fax':<xsl:value-of select="fax"/>',
	'mobile':<xsl:value-of select="mobile"/>',
	'email':<xsl:value-of select="email"/>',
	'web':<xsl:value-of select="web"/>',
	'tipi':<xsl:value-of select="tipi"/>',
	'tipi-specifici':<xsl:value-of select="tipi-specifici"/>'
	
	'times':[
		'starting_time':'
		<xsl:call-template name="dateTimeToEpoch">
			<xsl:with-param name="times/starting_time"/>
		</xsl:call-template>
		
		','ending_time:'
		<xsl:choose>
			<xsl:when test="times/ending_time > 0 and times/ending_time &lt; 6">SISTEMA</xsl:when>
			<xsl:otherwise><xsl:value-of select="times/ending_time"/></xsl:otherwise>
		</xsl:choose>
		'
	]
	},
	</xsl:for-each>
</xsl:template>

<xsl:template name="dateTimeToEpoch">
	<xsl:param name="dateTimeValue"/>
	<xsl:value-of select="( dateTime($dateTimeValue) - xsd:dateTime('1970-01-01T00:00:00') ) div xsd:dayTimeDuration('PT1S')"/>
</xsl:template>

</xsl:stylesheet>
