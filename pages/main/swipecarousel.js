import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import { Text } from '@ui-kitten/components';
import yellowHatImage from '../../images/chef-hat-yellow.png';
import whiteHatImage from '../../images/chef-hat-white.png';
import WhiteBestSeller from '../../images/white-best-seller.png';
import YellowBestSeller from '../../images/yellow-best-seller.png'
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; // Importa da expo-image-picker
import MenuForm from './menuform';

const { width: screenWidth } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

const days = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];

const Rating = ({ rating, setRating }) => {
  const renderHats = () => {
    const hats = [];
    for (let i = 1; i <= 5; i++) {
      hats.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Image
            source={i <= rating ? YellowBestSeller : WhiteBestSeller}
            style={styles.ratingHat}
          />
        </TouchableOpacity>
      );
    }
    return hats;
  };

  return <View style={styles.ratingContainer}>{renderHats()}</View>;
};

const Carousel = ({ data, username, updateData }) => {
  const scrollViewRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [day, setDay] = useState("")
  const [viewType, setViewType] = useState('sun');
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [popoverItem, setPopoverItem] = useState(null);
  const [popoverType, setPopoverType] = useState("")
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [dish, setDish] = useState("")
  const [dishname, setDishname] = useState("")
  const [photo, setPhoto] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [mealListModalVisible, setMealListModalVisible] = useState(false);
  const [meals, setMeals] = useState([]);
  const [isData, setIsData] = useState(true)
  const [mappedDayIndex, setmappedDayIndex] = useState(null)


  const popoverRef = useRef(null);

  const iconMap = {
    "spaghetti": require('../../images/spaghetti.png'),
    "meat": require('../../images/meat.png'),
    "fish": require('../../images/fish.png'),
    "cheese": require('../../images/cheese.png'),
    "healthy-food": require("../../images/healthy-food.png")
  };

  const openPopover = (item, event, type) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;

    const popoverWidth = 150;
    const popoverHeight = 150;

    let posX = pageX;
    let posY = pageY;

    // Verifica se il popover esce dal lato destro dello schermo
    if (posX + popoverWidth > screenWidth) {
      posX = screenWidth - popoverWidth;
    }

    // Verifica se il popover esce dal lato inferiore dello schermo
    if (posY + popoverHeight > screenHeight) {
      posY = screenHeight - popoverHeight;
    }

    setPopoverPosition({ x: posX, y: posY });
    setPopoverVisible(true);
    setPopoverItem(item);
    setPopoverType(type);
    setDish(item[type].id)
    setDishname(item[type].nome)
    setDay(item.giorno)
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  const handleEdit = async (item) => {
    try {
      await axios.post(`http://172.20.10.7:8080/changeMeal`, {
        id: item._id,
        username: username,
        orario: popoverType,
        day: day.toLowerCase()
      })
      setMealListModalVisible(false);
      updateData()
    }
    catch (e) {
      console.log(e)
    }
  };

  const handleReview = () => {
    setReviewModalVisible(true);
    closePopover();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://172.20.10.7:8080/deleteMeal/${username}`, {
        data: { mealId: popoverItem, orario: popoverType }
      });
      await updateData()
    }
    catch (e) {
      console.log(e)
    }
    closePopover();
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setSelectedDay(index);
  };

  const toggleViewType = () => {
    setViewType(viewType === 'sun' ? 'moon' : 'sun');
  };

  const scrollToCard = (index) => {
    setSelectedDay(index);
    const offset = index * screenWidth;
    if (scrollViewRef.current != null) {
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  };

  const renderChefHats = (averageRating) => {
    const chefHats = [];
    const integerPart = Math.floor(averageRating);
    const decimalPart = averageRating - integerPart;

    // Calcola la larghezza e l'altezza delle immagini
    const imageWidth = screenWidth * 0.05; // Larghezza della view moltiplicata per la percentuale desiderata
    const imageHeight = imageWidth; // Altezza uguale alla larghezza per mantenere l'aspetto quadrato

    // Aggiungi cappelli gialli
    for (let i = 0; i < integerPart; i++) {
      chefHats.push(<Image source={yellowHatImage} key={i} style={{ width: imageWidth, height: imageHeight }} />);
    }

    if (decimalPart > 0) {
      chefHats.push(
        <Image source={yellowHatImage} key={'decimal'} style={{ width: imageWidth, height: imageHeight, opacity: decimalPart }} />
      );
    }

    // Aggiungi cappelli bianchi per arrivare a 5 in totale
    const totalHats = integerPart + (decimalPart > 0 ? 1 : 0);
    for (let i = totalHats; i < 5; i++) {
      chefHats.push(<Image source={whiteHatImage} key={`white-${i}`} style={{ width: imageWidth, height: imageHeight }} />);
    }

    return chefHats;
  };

  const renderRating = (averageRating) => {
    const chefHats = [];
    const integerPart = Math.floor(averageRating);
    const decimalPart = averageRating - integerPart;

    // Calcola la larghezza e l'altezza delle immagini
    const imageWidth = screenWidth * 0.05; // Larghezza della view moltiplicata per la percentuale desiderata
    const imageHeight = imageWidth; // Altezza uguale alla larghezza per mantenere l'aspetto quadrato

    // Aggiungi cappelli gialli
    for (let i = 0; i < integerPart; i++) {
      chefHats.push(<Image source={YellowBestSeller} key={i} style={{ width: imageWidth, height: imageHeight }} />);
    }

    if (decimalPart > 0) {
      chefHats.push(
        <Image source={YellowBestSeller} key={'decimal'} style={{ width: imageWidth, height: imageHeight, opacity: decimalPart }} />
      );
    }

    // Aggiungi cappelli bianchi per arrivare a 5 in totale
    const totalHats = integerPart + (decimalPart > 0 ? 1 : 0);
    for (let i = totalHats; i < 5; i++) {
      chefHats.push(<Image source={WhiteBestSeller} key={`white-${i}`} style={{ width: imageWidth, height: imageHeight }} />);
    }

    return chefHats;
  };

  const getCurrentDay = () => {
    const now = new Date();
    const dayIndex = now.getDay();

    setmappedDayIndex((dayIndex === 0) ? 6 : dayIndex - 1)
  };

  useEffect(() => {
    getCurrentDay()
    setIsData(data.every(item => item.pranzo.nome === "" && item.cena.nome === ""))
  }, [data]);

  const handleReviewSubmit = async () => {
    try {
      await axios.post(`http://172.20.10.7:8080/sendReview/${rating}`, { photo: photo, dish: dish })
    }
    catch (e) {
      console.log(e)
    }
    setReviewModalVisible(false);
    setRating(0);
    setPhoto(null)
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      await compressAndConvertImageToBase64(result.assets[0].uri);
    }
  };

  const compressAndConvertImageToBase64 = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      const response = await fetch(manipResult.uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          const base64Image = reader.result;
          setPhoto(base64Image);
          resolve(base64Image);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error compressing and converting image to base64:', error);
      return null;
    }
  };

  const openImageModal = (imageUri) => {
    if (imageUri.length > 0) {
      setSelectedImage(imageUri);
      setImageModalVisible(true);
    }
    else {
      Alert.alert("Non ci sono foto da visualizzare")
    }
  };

  // Funzione per chiudere il modal delle immagini
  const closeImageModal = () => {
    setSelectedImage([]);
    setImageModalVisible(false);
  };

  const handleImage = async (item) => {
    try {
      const response = await axios.get(`http://172.20.10.7:8080/getPhotos/${item}`)
      openImageModal(response.data)
    }
    catch (e) {
      console.log(e)
    }
  }

  const openMealListModal = async () => {
    try {
      closePopover();
      const response = await axios.get(`http://172.20.10.7:8080/getAllMeals/${username}`);
      setMeals(response.data);
      setMealListModalVisible(true);
    } catch (e) {
      console.log(e);
    }
  };

  const closeMealListModal = () => {
    setMealListModalVisible(false);
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await compressAndConvertImageToBase64(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Errore durante la cattura della foto:', error);
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permesso necessario per accedere alla libreria media!');
      }
    }
  };


  return (
    <View style={{ flex: 1 }}>

      {/* Modal per aprire le impostazioni del piatto */}
      <Modal visible={popoverVisible} transparent animationType="fade" onRequestClose={closePopover}>
        <TouchableOpacity style={styles.modalBackground} onPress={closePopover}>
          <View ref={popoverRef} style={[styles.popoverContainer, { top: popoverPosition.y, left: popoverPosition.x },]}>
            <TouchableOpacity onPress={openMealListModal}>
              <Text style={styles.popoverItem}>Cambia</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReview}>
              <Text style={styles.popoverItem}>Recensisci</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete()}>
              <Text style={styles.popoverItem}>Elimina</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal per la recensione */}
      <Modal visible={reviewModalVisible} transparent animationType="fade" onRequestClose={() => setReviewModalVisible(false)}>
        <View style={styles.reviewModalBackground}>
          <View style={styles.reviewModalContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.modalTitle, { paddingHorizontal: 45 }]}>{dishname}</Text>
              <TouchableOpacity onPress={() => { setReviewModalVisible(false); setRating(0); setPhoto(null) }}>
                <Image source={require('../../images/close.png')} style={styles.optionIcon} />
              </TouchableOpacity>
            </View>
            <Rating rating={rating} setRating={setRating} />
            <TouchableOpacity onPress={pickImage}>
              <Text style={[styles.popoverItem, { marginBottom: 20 }]}>Inserisci foto dalla libreria</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto}>
              <Text style={[styles.popoverItem, { marginBottom: 20 }]}>Scatta foto</Text>
            </TouchableOpacity>
            <View style={{ marginBottom: 20 }}>
              {photo ?
                <View>
                  <View style={{ marginBottom: 20, borderColor: "black", borderWidth: 0.5 }}>
                    <Image source={{ uri: photo }} style={{ width: 100, height: 100 }} />
                  </View>
                  <TouchableOpacity onPress={() => setPhoto(null)} style={{ justifyContent: "flex-start" }}>
                    <Text style={styles.popoverItem}>Elimina Foto</Text>
                  </TouchableOpacity>
                </View>
                : null}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
              <Text style={styles.submitButtonText}>Invia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal per la visualizzazione delle foto */}
      <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={closeImageModal}>
        <View style={styles.imageModalBackground}>
          <ScrollView horizontal pagingEnabled>
            {selectedImage.length > 0 ? (
              selectedImage.map((imageUri, index) => (
                <View key={index} style={styles.imageModalContainer}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: imageUri }} style={styles.selectedImageStyle} />
                  </View>
                  <Text style={styles.imageCounter}>
                    {index + 1} / {selectedImage.length}
                  </Text>
                  <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
                    <Image source={require('../../images/close.png')} style={styles.optionIcon} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.imageModalContainer}>
                <Text style={styles.noImageText}>
                  Non ci sono foto disponibili per questo piatto
                </Text>
              </View>
            )}

          </ScrollView>
        </View>
      </Modal>

      {/* Modal per il cambio del piatto */}
      <Modal visible={mealListModalVisible} transparent animationType="fade" onRequestClose={closeMealListModal}>
        <View style={styles.mealListModalBackground}>
          <View style={styles.mealListModalContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.modalTitle}>Scegli un Piatto</Text>
              <TouchableOpacity onPress={closeMealListModal}>
                <Image source={require('../../images/close.png')} style={styles.optionIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.mealList}>
              {meals.map((meal, index) => (
                <TouchableOpacity key={index} style={styles.mealItem} onPress={() => handleEdit(meal)}>
                  <Text style={styles.mealItemText}>{meal.nome}</Text>
                  <Text style={styles.mealItemSubText}>Ingredienti: {meal.ingredients.join(', ')}</Text>
                  <Text style={styles.mealItemSubText}>Difficoltà: {meal.difficulty}</Text>
                  <Text style={styles.mealItemSubText}>Tempo: {meal.timing} min</Text>
                  <Text style={styles.mealItemSubText}>Rating: {meal.rating.toFixed(1)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {!isData ?
        <View>
          <View style={styles.daysListContainer}>
            <View style={styles.daysList}>
              {data ? (
                days.map((day, index) => (
                  <TouchableOpacity key={index} onPress={() => scrollToCard(index)} style={[styles.dayButton, selectedDay === index && styles.selectedDayButton]}>
                    <Text style={[styles.dayText, selectedDay === index && styles.selectedDayText, index === mappedDayIndex && styles.currentDay]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : null}

            </View>
          </View>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16}>
            {data
              ? data.map((item, index) => (
                <View key={index}>

                  {/* Card del giorno */}
                  <View style={styles.card}>
                    <Text style={styles.title}>{item.giorno}</Text>
                    <View style={styles.cardContent}>
                      <View style={{ justifyContent: 'space-between' }}>
                        <Text style={{ color: 'black', fontFamily: 'MyriadPro-Regular', fontSize: 20 }}>Pranzo</Text>
                        {item.pranzo.nome !== '' && item.pranzo.icon && iconMap[item.pranzo.icon] ? (
                          <Image source={iconMap[item.pranzo.icon]} style={[styles.foodIcon, styles.icon]} />
                        ) : null}
                      </View>
                      <View style={{ justifyContent: 'space-between' }}>
                        <Text style={{ color: 'black', fontFamily: 'MyriadPro-Regular', fontSize: 20 }}>Cena</Text>
                        {item.cena.nome !== '' && item.cena.icon && iconMap[item.cena.icon] ? (
                          <Image source={iconMap[item.cena.icon]} style={[styles.foodIcon, styles.icon]} />
                        ) : null}
                      </View>
                    </View>
                  </View>

                  <View style={styles.separatorDiv}>
                    <View style={styles.separator} />
                  </View>

                  {/* Card di descrizione del pasto */}
                  <View style={{ flex: 1, marginBottom: 20 }}>
                    <View style={styles.descriptionCard}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {viewType === 'sun' ? (
                          <View>
                            {item.pranzo.nome !== '' ? (
                              <View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 25, height: 25, marginHorizontal: 15 }} />
                                    <Text style={[styles.descriptionMeal, { flex: 1, textAlign: 'center' }]}>{item.pranzo.nome}</Text>
                                    <TouchableOpacity onPress={(e) => openPopover(item, e, "pranzo")}>
                                      <Image source={require('../../images/dots.png')} style={styles.optionIcon} />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingVertical: 5 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18 }}>Difficoltà:</Text>
                                  <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                    {renderChefHats(item.pranzo.difficolta)}
                                  </View>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingVertical: 5 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18 }}>Rating:</Text>
                                  <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                    {renderRating(item.pranzo.rating)}
                                  </View>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingVertical: 5 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18 }}>Tempo:</Text>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Light", fontSize: 16, paddingTop: 2, marginHorizontal: 5 }}>{item.pranzo.tempo} minuti</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18, paddingVertical: 5 }}>Ingredienti: </Text>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Light", fontSize: 16, paddingTop: 7, marginHorizontal: 5 }}>{item.pranzo.ingredients}</Text>
                                </View>
                                <Text style={styles.descriptionText}>{item.pranzo.description}</Text>
                                <TouchableOpacity onPress={() => handleImage(item.pranzo.nome)} >
                                  <Text style={{ justifyContent: "center", alignSelf: "center", fontSize: 18, color: "black", fontFamily: "MyriadPro-SemiBold", borderRadius: 10, borderWidth: 0.5, padding: 10 }}>Vedi i piatti degli altri</Text>
                                </TouchableOpacity>
                              </View>)
                              :
                              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                                <Text style={{ color: "black", fontFamily: "MyriadPro-SemiBold", fontSize: 24, textAlign: "center", marginBottom: 20 }}>
                                  Non hai programmato il pranzo per {item.giorno.toLowerCase()}
                                </Text>
                                <TouchableOpacity onPress={() => { setPopoverType("pranzo"); setDay(item.giorno); openMealListModal(); }}>
                                  <Text style={{ color: "black", alignSelf: "center", fontFamily: "MyriadPro-Bold", fontSize: 20, borderColor: "black", borderWidth: 0.5, padding: 15, borderRadius: 15, marginTop: 20 }}>
                                    Aggiungi il pranzo
                                  </Text>
                                </TouchableOpacity>
                              </View>

                            }
                          </View>
                        ) : (
                          <View>
                            {item.cena.nome !== '' ?
                              <View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 25, height: 25, marginHorizontal: 15 }} />
                                    <Text style={[styles.descriptionMeal, { flex: 1, textAlign: 'center' }]}>{item.cena.nome}</Text>
                                    <TouchableOpacity onPress={(e) => openPopover(item, e, "cena")}>
                                      <Image source={require('../../images/dots.png')} style={styles.optionIcon} />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingVertical: 5 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18 }}>Difficoltà:</Text>
                                  <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                    {renderChefHats(item.cena.difficolta)}
                                  </View>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingVertical: 5 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18 }}>Rating:</Text>
                                  <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                    {renderRating(item.cena.rating)}
                                  </View>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingVertical: 5 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18 }}>Tempo:</Text>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Light", fontSize: 16, paddingTop: 2, marginHorizontal: 5 }}>{item.cena.tempo} minuti</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 }}>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Regular", fontSize: 18, paddingVertical: 5 }}>Ingredienti: </Text>
                                  <Text style={{ color: "black", fontFamily: "MyriadPro-Light", fontSize: 16, paddingTop: 7, marginHorizontal: 5 }}>{item.cena.ingredients}</Text>
                                </View>
                                <Text style={styles.descriptionText}>{item.cena.description}</Text>
                                <TouchableOpacity onPress={() => handleImage(item.cena.nome)} >
                                  <Text style={{ justifyContent: "center", alignSelf: "center", fontSize: 18, color: "black", fontFamily: "MyriadPro-SemiBold", borderRadius: 10, borderWidth: 0.5, padding: 10 }}>Vedi i piatti degli altri</Text>
                                </TouchableOpacity>
                              </View>
                              :
                              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                                <Text style={{ color: "black", fontFamily: "MyriadPro-SemiBold", fontSize: 24, textAlign: "center", marginBottom: 20 }}>
                                  Non hai programmato la cena per {item.giorno.toLowerCase()}
                                </Text>
                                <TouchableOpacity onPress={() => { setPopoverType("cena"); setDay(item.giorno); openMealListModal(); }}>
                                  <Text style={{ color: "black", alignSelf: "center", fontFamily: "MyriadPro-Bold", fontSize: 20, borderColor: "black", borderWidth: 0.5, padding: 15, borderRadius: 15, marginTop: 20 }}>
                                    Aggiungi la cena
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            }

                          </View>
                        )}
                      </ScrollView>
                    </View>
                    <View style={styles.toggleContainer}>
                      <TouchableOpacity
                        onPress={toggleViewType}
                        style={[
                          styles.toggleButton,
                          viewType === 'sun' ? styles.sunBackground : styles.moonBackground
                        ]}
                      >
                        <Image
                          source={require('../../images/sun.png')}
                          style={[styles.toggleIcon, viewType === 'moon' && styles.inactiveIcon]}
                        />
                        <Image
                          source={require('../../images/half-moon.png')}
                          style={[styles.toggleIcon, viewType === 'sun' && styles.inactiveIcon]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              ))
              : null}
          </ScrollView>
        </View>
        : <MenuForm username={username} updateData={updateData} />}
    </View>
  );
};

const styles = StyleSheet.create({
  daysListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  daysList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  dayButton: {
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 5,
  },
  currentDay: {
    color: "#407F40",
  },
  dayText: {
    color: 'black',
    fontFamily: 'MyriadPro-SemiBold',
    fontSize: 18,
  },
  selectedDayButton: {
    backgroundColor: '#E9DDC6',
    borderRadius: 15,
  },
  selectedDayText: {
    color: '#9B0800',
  },
  carousel: {
    justifyContent: 'center',
    flexGrow: 1,
    marginTop: screenHeight * 0.02,
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: 'black',
    marginVertical: 20,
  },
  separatorDiv: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: (screenWidth - CARD_WIDTH) / 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
    paddingVertical: 25,
  },
  title: {
    color: 'black',
    fontFamily: 'MyriadPro-SemiBold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardContent: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  icon: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    resizeMode: 'contain',
  },
  foodIcon: {
    marginTop: '50%',
  },
  descriptionCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT * 1.5,
    marginHorizontal: (screenWidth - CARD_WIDTH) / 2,
    paddingHorizontal: 0,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 20,
    flex: 5
  },
  descriptionText: {
    color: 'black',
    fontFamily: 'MyriadPro-Light',
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: "justify",
    paddingVertical: 10
  },
  descriptionMeal: {
    color: 'black',
    fontFamily: 'MyriadPro-SemiBold',
    fontSize: 24,
    textAlign: 'center',
    paddingBottom: 5
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flex: 1
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
    borderWidth: 0.5
  },
  sunBackground: {
    backgroundColor: 'white',
  },
  moonBackground: {
    backgroundColor: 'white',
  },
  toggleIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginHorizontal: 15,
  },
  optionIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginHorizontal: 15,
  },
  inactiveIcon: {
    opacity: 0.2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  popoverItem: {
    fontSize: 16,
    color: "black",
    fontFamily: "MyriadPro-Regular",
    padding: 10
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reviewModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  reviewModalContainer: {
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'MyriadPro-Regular',
    marginRight: 10
  },
  ratingInput: {
    width: 50,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontFamily: 'MyriadPro-Regular',
    fontSize: 16,
    color: '#000'
  },
  submitButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#6200ea',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'MyriadPro-Bold',
    color: '#fff'
  },
  ratingHat: {
    width: 30,
    height: 30,
    margin: 5
  },
  imageModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    marginHorizontal: (screenWidth - CARD_WIDTH) / 2,
    justifyContent: 'center',
    alignSelf: "center",
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    elevation: 3,
    paddingVertical: 15,
  },
  imageWrapper: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImageStyle: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  imageCounter: {
    color: 'black',
    fontFamily: 'MyriadPro-Light',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  mealListModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealListModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    height: CARD_HEIGHT * 1.8
  },
  modalTitle: {
    fontSize: 22,
    color: "black",
    fontFamily: "MyriadPro-Bold",
    marginBottom: 10
  },
  mealList: {
    marginTop: 20,
  },
  mealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mealItemText: {
    fontSize: 18,
    fontFamily: "MyriadPro-SemiBold",
    color: "black"
  },
  mealItemSubText: {
    fontSize: 16,
    color: "black",
    fontFamily: "MyriadPro-Light"
  },
});

export default Carousel;