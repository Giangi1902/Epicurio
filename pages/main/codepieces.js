<View style={{ alignItems: "center", flex: 1, marginTop: 15 }}>
<View style={styles.imageContainer}>
    <ImageBackground source={require("../../emptyshelf.jpg")} style={styles.image}>
        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
            <TouchableOpacity onPress={() => handleCategory("riso")}>
                <Image source={require('../../images/rice.png')} style={[styles.icon]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("pasta")}>
                <Image source={require('../../images/spaghetti.png')} style={[styles.icon]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("panificio")}>
                <Image source={require('../../images/bread.png')} style={[styles.icon]} />
            </TouchableOpacity>
        </View>
        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
            <TouchableOpacity onPress={() => handleCategory("carne")}>
                <Image source={require('../../images/meat.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("pesce")}>
                <Image source={require('../../images/fish.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("latte e formaggi")}>
                <Image source={require('../../images/cheese.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
            <TouchableOpacity onPress={() => handleCategory("frutta e verdura")}>
                <Image source={require('../../images/healthy-food.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("surgelati")}>
                <Image source={require('../../images/frozen-food.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("biscotti")}>
                <Image source={require('../../images/cookie.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
        <View style={[styles.iconContainer, { flexDirection: "row", justifyContent: "space-around", width: "100%" }]}>
            <TouchableOpacity onPress={() => handleCategory("bevande")}>
                <Image source={require('../../images/plastic.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("condimenti")}>
                <Image source={require('../../images/olive-oil.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCategory("altro")}>
                <Image source={require('../../images/surprise-box.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
    </ImageBackground>
</View>
</View>
